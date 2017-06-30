import m from "mithril";
import { randomGif } from "../random-gif";
import { nestComponent } from "../util";

const add = update => () => update(model => {
  const randomGifModel = randomGif.model();
  model.randomGifIds.push(randomGifModel.id);
  model.randomGifsById[randomGifModel.id] = randomGifModel;
  return model;
});

const remove = (update, id) => () => update(model => {
  delete model.randomGifsById[id];
  model.randomGifIds.splice(model.randomGifIds.indexOf(id), 1);
  return model;
});

export const randomGifList = {
  model: () => ({
    randomGifIds: [],
    randomGifsById: {}
  }),
  create: event => update => {
    const renderRandomGif = model => id =>
      m("div.dib", { key: id }, [
        nestComponent(randomGif.create(event), update, ["randomGifsById", id])(model),
        m("button.f8.link.dim.ph2.br2.ba.red.b--red.bg-white", { onclick: remove(update, id) }, "Remove")
      ]);

    return model => m("div.ba.br2.b--orange.pa2", [
      m("div", [
        m("button.f8.link.dim.ph2.br2.ba.blue.b--blue.bg-white", { onclick: add(update) }, "Add")
      ]),
      m("div", model.randomGifIds.map(renderRandomGif(model)))
    ]);
  }
};
