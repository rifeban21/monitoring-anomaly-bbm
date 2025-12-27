import numpy as np
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.transaction import Transaction
from app.models.anomaly import AnomalyResult


# Ambil Data Histori Transaksi
async def get_history(db, location_id, product_id, window=30):
    result = await db.execute(
        select(Transaction.volume)
        .where(
            Transaction.location_id == location_id,
            Transaction.product_id == product_id
        )
        .order_by(Transaction.date.desc())
        .limit(window)
    )
    volumes = [r[0] for r in result.all()]
    # Exclude data point terbaru (transaksi saat ini)
    return volumes[1:] if len(volumes) > 1 else volumes


# Hitung Median & MAD
# rumus: 
#       MAD = median(|x - median|)
 
def compute_median_mad(values):
    median = np.median(values)
    mad = np.median([abs(v - median) for v in values])
    return median, mad


# Trend Detection
def detect_trend(values):
    if len(values) < 3:
        return False
    return values[0] > values[1] > values[2]


# Risk Score
def calculate_risk(robust_z, trend):
    score = min(robust_z * 20, 80)

    if trend:
        score += 20

    return min(int(score), 100)


# Anomaly Detector
async def run_anomaly_detection(
    db: AsyncSession,
    transaction: Transaction
):
    history = await get_history(
        db,
        transaction.location_id,
        transaction.product_id
    )

    if len(history) < 5:
        return  # belum cukup data

    median, mad = compute_median_mad(history)

    # Risk Score
    # rumus: 
    #       robust_z = |x - median| / (MAD + ε)
    robust_z = abs(transaction.volume - median) / (mad + 1e-6)

    # Trend Detection
    # Deteksi:
    #   - naik terus 3 hari
    #   - slope tajam
    trend = detect_trend(history[:3])

    risk_score = calculate_risk(robust_z, trend)

    # Status
    if risk_score < 40:
        status = "NORMAL"
    elif risk_score < 70:
        status = "WASPADA"
    else:
        status = "ANOMALI"


    anomaly = AnomalyResult(
        transaction_id=transaction.id,
        location_id=transaction.location_id,
        product_id=transaction.product_id,
        volume=transaction.volume,
        baseline=median,
        risk_score=risk_score,
        status=status,
        reasons=[
            f"Volume {transaction.volume} melebihi baseline {median:.2f}",
            f"Risk score {risk_score}"
        ]
    )

    db.add(anomaly)
    await db.commit()


async def get_history_before(db, location_id, product_id, before_date, window=30):
    result = await db.execute(
        select(Transaction.volume)
        .where(
            Transaction.location_id == location_id,
            Transaction.product_id == product_id,
            Transaction.date < before_date
        )
        .order_by(Transaction.date.desc())
        .limit(window)
    )
    return [r[0] for r in result.all()]


async def scan_and_create_anomalies(db: AsyncSession, location_id: int, product_id: int, min_risk: int = 0, window: int = 30):
    # select transactions for this location+product ordered by date asc
    result = await db.execute(
        select(Transaction)
        .where(
            Transaction.location_id == location_id,
            Transaction.product_id == product_id
        )
        .order_by(Transaction.date.asc())
    )
    transactions = result.scalars().all()

    created = []

    for trx in transactions:
        history = await get_history_before(db, location_id, product_id, trx.date, window=window)
        if len(history) < 5:
            continue

        median, mad = compute_median_mad(history)
        robust_z = abs(trx.volume - median) / (mad + 1e-6)
        trend = detect_trend(history[:3])
        risk_score = calculate_risk(robust_z, trend)

        if risk_score < min_risk:
            continue

        if risk_score < 40:
            status = "NORMAL"
        elif risk_score < 70:
            status = "WASPADA"
        else:
            status = "ANOMALI"

        # skip if anomaly already exists for this transaction
        exists = await db.execute(select(AnomalyResult).where(AnomalyResult.transaction_id == trx.id))
        if exists.scalar_one_or_none():
            continue

        anomaly = AnomalyResult(
            transaction_id=trx.id,
            location_id=location_id,
            product_id=product_id,
            volume=trx.volume,
            baseline=median,
            risk_score=risk_score,
            status=status,
            reasons=[
                f"Volume {trx.volume} melebihi baseline {median:.2f}",
                f"Risk score {risk_score}"
            ]
        )

        db.add(anomaly)
        await db.commit()
        created.append({
            "transaction_id": trx.id,
            "date": trx.date,
            "location_name": None,
            "product_name": None,
            "volume": float(trx.volume),
            "baseline": float(median),
            "risk_score": int(risk_score),
            "status": status,
            "reasons": anomaly.reasons,
        })

    return created
