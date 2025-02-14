import { FreshContext } from "$fresh/server.ts";
import SvgEditor from "../islands/SvgEditor.tsx";

export default function mapping(_req: Request, _ctx: FreshContext) {
    return (
        <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 class="text-2xl font-bold mb-4">SVG Mapping</h1>
            <SvgEditor />
        </div>
    );
}
