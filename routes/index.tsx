import { Head } from "$fresh/runtime.ts";
import OfficeMap from "../islands/OfficeMap.tsx";
import { Handlers } from "$fresh/server.ts";
import { getChairData } from "../services/databaseService.ts";

export const handler: Handlers = {
  async GET(_, ctx) {
    try {
      const chairData = await getChairData();
      const data = await Deno.readTextFile("./static/office-map.json");
      const mapData = JSON.parse(data);
      return ctx.render({ mapData, chairData });
    } catch (error) {
      console.error(error);
      return ctx.render({ mapData: {}, chairData: {} });
    }
  },
};

export default function Home({ data }) {
  return (
    <>
      <Head>
        <title>Office Map</title>
      </Head>
      <div class="container">
        <OfficeMap mapData={data.mapData} chairData={data.chairData} />
      </div>
    </>
  );
}
