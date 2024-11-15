// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_joke from "./routes/api/joke.ts";
import * as $api_saveReservation from "./routes/api/saveReservation.ts";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $DatePicker from "./islands/DatePicker.tsx";
import * as $HomeButton from "./islands/HomeButton.tsx";
import * as $MapSelector from "./islands/MapSelector.tsx";
import * as $Nav from "./islands/Nav.tsx";
import * as $OfficeMap from "./islands/OfficeMap.tsx";
import * as $Sidebar from "./islands/Sidebar.tsx";
import * as $TimePicker from "./islands/TimePicker.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/joke.ts": $api_joke,
    "./routes/api/saveReservation.ts": $api_saveReservation,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
    "./islands/DatePicker.tsx": $DatePicker,
    "./islands/HomeButton.tsx": $HomeButton,
    "./islands/MapSelector.tsx": $MapSelector,
    "./islands/Nav.tsx": $Nav,
    "./islands/OfficeMap.tsx": $OfficeMap,
    "./islands/Sidebar.tsx": $Sidebar,
    "./islands/TimePicker.tsx": $TimePicker,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
