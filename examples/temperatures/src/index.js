import flyd from "flyd";
import { render } from "preact";

import { createApp } from "./app";

const update = flyd.stream();
const app = createApp(update);
const initialModel = app.model();
const applyUpdate = (model, modelUpdate) => modelUpdate(model);
const model = flyd.scan(applyUpdate, initialModel, update);

const element = document.getElementById("app");
model.map(model => render(app.view(model), element, element.lastElementChild));

// Only for using Meiosis Tracer in development.
import { trace } from "meiosis";
import meiosisTracer from "meiosis-tracer";
trace({ update, dataStreams: [ model ] });
meiosisTracer({ selector: "#tracer" });
