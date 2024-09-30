from motor import motor_asyncio
from model.model import EmployeeDetail

client = motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017/")
db = client["usage"]
collection = db["usage"]

async def insert_root(document):
    result = await collection.insert_one(document)
    return result.inserted_id

async def get_detail():
    datas = []
    cursor = collection.find({})
    async for doc in cursor:
        datas.append(EmployeeDetail(**doc))
    return  list(reversed(datas))