import * as React from "react";
import ProductHero from "../view/ProductHero";
import ProductValues from "../view/ProductValues";

import withRoot from "../withRoot";

function Main() {
  return (
    <React.Fragment>
      <ProductHero />
      <ProductValues />
    </React.Fragment>
  );
}
export default withRoot(Main);
