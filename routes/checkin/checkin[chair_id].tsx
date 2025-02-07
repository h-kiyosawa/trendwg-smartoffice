import { PageProps } from "$fresh/server.ts";
import LoginMobile from "../../islands/LoginMobile.tsx";

export default function CheckinPage(props: PageProps) {
    const { chair_id } = props.params;

    return (
        <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 class="text-xl font-bold mb-4">Chair ID: {chair_id}</h1>
            <LoginMobile chair_id={chair_id} />
        </div>
    );
}
