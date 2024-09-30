import asyncio
from datetime import datetime
import pygetwindow as gw
from database.db import insert_root

async def get_active_window_title():
    try:
        return gw.getActiveWindow().title
    except Exception:
        return "Unknown"

async def track_usage():
    current_app = None
    start_time = None

    while True:
        try:
            active_app = await get_active_window_title()
            
            if active_app != current_app:
                if current_app is not None:
                    end_time = datetime.now()
                    duration = end_time - start_time
                    document = {
                        "app_name": current_app,
                        "start_time": start_time.strftime("%Y-%m-%d %H:%M:%S"),
                        "end_time": end_time.strftime("%Y-%m-%d %H:%M:%S"),
                        "duration": str(duration)
                    }
                    await insert_root(document)
                
                current_app = active_app
                start_time = datetime.now()
            
            await asyncio.sleep(1)
        except Exception as e:
            # Log or handle the exception if necessary
            print(f"Error in track_usage: {e}")
            break
