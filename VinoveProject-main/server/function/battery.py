import psutil

def get_battery_status():
    battery = psutil.sensors_battery()
    if battery is None:
        return {
            'error': 'Battery information is not available.'
        }

    return {
        'battery_level': battery.percent,
        'charging': battery.power_plugged,
        'warning': battery.percent < 20
    }
