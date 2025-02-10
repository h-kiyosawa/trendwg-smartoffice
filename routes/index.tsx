import { Head } from "$fresh/runtime.ts";
import OfficeMap from "../islands/OfficeMap.tsx";
import Nav from "../islands/Nav.tsx";
import { Handlers } from "$fresh/server.ts";
import { getChairData, getMapData } from "../services/databaseService.ts";
import { getCookies } from "$std/http/cookie.ts";
import { getJwtPayload, inspectAlgorithm } from "../util/jwt.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      // ログイン判定
      const cookies = getCookies(req.headers);
      const jwtToken = cookies.token || "";

      let payload = null;
      if ((await inspectAlgorithm(jwtToken))) {
        payload = await getJwtPayload(jwtToken);
        // プロフィール画像がnullまたは空ならデフォルト画像を設定
        if (!payload.profile_picture) {
          payload.profile_picture =
            "profile_picture/profile_picture_DEFAULT.jpg";
        }
      }
      const chairData = await getChairData();
      const mapData = await getMapData();
      const response = ctx.render({ mapData, chairData, payload });
      return response;
    } catch (error) {
      console.error(error);
      return ctx.render({ mapData: {}, chairData: {}, payload: null });
    }
  },
};

export default function Home({ data }) {
  return (
    <Layout payload={data.payload}>
      <div>
        <OfficeMap
          mapData={data.mapData}
          chairData={data.chairData}
          payload={data.payload}
        />
      </div>
    </Layout>
  );
}

export const Layout = ({ children, payload }) => {
  return (
    <>
      <Nav payload={payload} />
      {children}
    </>
  );
};
