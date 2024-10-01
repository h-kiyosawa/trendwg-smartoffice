import { Head } from "$fresh/runtime.ts";
import OfficeMap from "../islands/OfficeMap.tsx";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_, ctx) {
    const data = await Deno.readTextFile("./static/office-map.json");
    const mapData = JSON.parse(data);
    return ctx.render({ mapData });
  },
};

export default function Home({ data }) {
  return (
    <>
      <Head>
        <title>Office Map</title>
      </Head>
      <div class="container">
        <OfficeMap mapData={data.mapData} />
      </div>
    </>
  );
}
