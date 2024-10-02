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
