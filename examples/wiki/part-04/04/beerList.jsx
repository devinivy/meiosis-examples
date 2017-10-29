import { pages } from "./navigation";

export const createBeerList = (actions, router) => ({
  view: model => (
    <div>
      <p>Beer List</p>
      <ul>
        {model.beerList.map(beer =>
          <li key={beer.id}>
            <a href={router.getLink(pages.beerDetails.id, {beerId: beer.id})}>{beer.title}</a>
            {" "}
            <button className="btn btn-default btn-xs"
              onClick={actions.beerDetails(beer.id)}>
              {beer.title}
            </button>
          </li>
        )}
      </ul>
    </div>
  )
});

