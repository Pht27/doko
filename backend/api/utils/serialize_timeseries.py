from decimal import Decimal
from datetime import date

def serialize_timeseries(timeseries):
    return [
        {
            "Datum": entry["date_played"].isoformat(),  # e.g. '2024-07-12'
            "Punkte": round(float(entry["cumulative_points"]), 1)  # Rounded to 1 decimal
        }
        for entry in timeseries
    ]
