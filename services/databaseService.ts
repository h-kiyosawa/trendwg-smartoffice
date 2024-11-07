import client from "../db.ts";

export async function getChairData() {
    const result = await client.queryArray(
        "SELECT seat_id, seat_name FROM seats",
    );
    return result.rows.reduce((acc, [id, name]) => {
        acc[id] = name;
        return acc;
    }, {});
}

export async function getMapData() {
    const result = await client.queryArray(
        "SELECT map_id, map_name, map_data FROM maps",
    );
    return result.rows.reduce((acc, [id, name, data]) => {
        acc[id] = {
            name: name,
            data: data,
        };
        return acc;
    }, {});
}
