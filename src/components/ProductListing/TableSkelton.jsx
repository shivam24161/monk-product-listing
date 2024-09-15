import { IndexTable, SkeletonBodyText } from "@shopify/polaris";
import React, { Fragment } from "react";

const columnHeadings = [
  { title: "Name", id: "column-header--size" },
  {
    id: "column-header--price",
    title: "Price",
  },
  {
    id: "column-header--quantity",
    title: "Available",
  },
];

function TableSkelton() {
  const rowMarkup = Array.from({ length: 7 })
    .fill({
      price: "$2,400",
      size: "Small",
      color: "Orange",
    })
    .map((color, index) => {
      return (
        <Fragment key={index}>
          <IndexTable.Row
            key={index}
            id={`${index}`}
            position={index}
            disabled={true}
          >
            <IndexTable.Cell scope="row">
              <div className="custom-skelton">
                <SkeletonBodyText lines={1} />
              </div>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <div className="custom-skelton">
                <SkeletonBodyText lines={1} />
              </div>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <div className="custom-skelton">
                <SkeletonBodyText lines={1} />
              </div>
            </IndexTable.Cell>
          </IndexTable.Row>
        </Fragment>
      );
    });

  return (
    <IndexTable itemCount={7} headings={columnHeadings}>
      {rowMarkup}
    </IndexTable>
  );
}

export default TableSkelton;
