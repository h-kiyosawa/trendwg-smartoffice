import { Head } from "$fresh/runtime.ts";
import OfficeMap from "../islands/OfficeMap.tsx";
import Nav from "../islands/Nav.tsx";
import { Handlers } from "$fresh/server.ts";
import { getChairData, getMapData } from "../services/databaseService.ts";

export const handler: Handlers = {
  async GET(_, ctx) {
    try {
      const chairData = await getChairData();
      const mapData = await getMapData();
      return ctx.render({ mapData, chairData });
    } catch (error) {
      console.error(error);
      return ctx.render({ mapData: {}, chairData: {} });
    }
  },
};

export default function Home({ data }) {
  return (
    <Layout>
      <div>
        <OfficeMap mapData={data.mapData} chairData={data.chairData} />
      </div>
    </Layout>
  );
}

export const Layout = ({ children }) => {
  return (
    <>
      <Nav />
      {children}
    </>
  );
};
