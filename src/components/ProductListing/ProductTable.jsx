import {
  LegacyCard,
  Text,
  useIndexResourceState,
  IndexTable,
  InlineStack,
  Modal,
  Divider,
  TextField,
  Icon,
} from "@shopify/polaris";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { apiKey, apiUrl } from "../../constants/apiUrl";
import { MyContext } from "../../context/Context";
import { SearchIcon } from "@shopify/polaris-icons";
import TableSkelton from "./TableSkelton";
import useDebounce from "../../utility/useDebounce";
import "./ProductListing.css";

const columnHeadings = [
  { title: "Name", id: "column-header--size" },
  {
    id: "column-header--quantity",
    title: "Available",
  },
  {
    id: "column-header--price",
    title: "Price",
  },
];

const ProductTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedProducts, setGroupedProducts] = useState({});
  const { setSelectedData, openModal, setOpenModal, removeSelectedKey } =
    useContext(MyContext);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(searchValue, 1000);
  const [checkScroll, setCheckScroll] = useState(false);

  const fetchApi = async () => {
    setLoading(true);
    let temp = [];
    const searchUrl = `${apiUrl}?search=${debouncedQuery}&page=${page}&limit=10`;
    const baseUrl = `${apiUrl}?page=${page}&limit=10`;
    const response = await fetch(debouncedQuery === "" ? baseUrl : searchUrl, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    const result = await response.json();
    if (result) {
      result.forEach((product) => {
        if (product.variants) {
          product.variants.forEach((variant) => {
            temp.push({
              ...variant,
              parentTitle: product.title,
              parentImage: product.image,
            });
          });
        }
      });
      setRows(temp);
    } else {
      setRows([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const modalBody = document.querySelector(".Polaris-Modal__Body");
    const handleScroll = () => {
      setCheckScroll(true);
      if (modalBody.scrollTop === 0 && checkScroll && page > 1) {
        console.log("inside");
        setPage((page) => page - 1);
      }
    };
    modalBody?.addEventListener("scroll", handleScroll);
    return () => {
      modalBody?.removeEventListener("scroll", handleScroll);
      setCheckScroll(false);
    };
  }, [openModal, checkScroll, page]);

  useEffect(() => {
    fetchApi();
  }, [page, debouncedQuery]);

  useEffect(() => {
    setGroupedProducts(
      groupRowsByGroupKey("product_id", (product_id) => product_id)
    );
  }, [rows]);

  const groupRowsByGroupKey = (groupKey, resolveId) => {
    let position = -1;
    const groups = rows.reduce((groups, product) => {
      const groupVal = product[groupKey];
      if (!groups[groupVal]) {
        position += 1;

        groups[groupVal] = {
          position,
          products: [],
          id: resolveId(groupVal),
        };
      }
      groups[groupVal].products.push({
        ...product,
        position: position + 1,
      });

      position += 1;
      return groups;
    }, {});

    return groups;
  };

  const convertData = (data, groupKey) => {
    const mainGroups = new Map();
    data.forEach((product) => {
      const groupVal = product[groupKey];
      if (!mainGroups.has(groupVal)) {
        mainGroups.set(groupVal, []);
      }
      mainGroups.get(groupVal).push(product);
    });
    return Array.from(mainGroups, ([key, items]) => ({
      key,
      title: items[0].parentTitle,
      items,
    }));
  };

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
    removeSelectedResources,
  } = useIndexResourceState(rows);

  useEffect(() => {
    removeSelectedResources(removeSelectedKey);
  }, [removeSelectedKey]);

  const rowMarkup = Object.keys(groupedProducts).map((color, index) => {
    const { products, position, id: productId } = groupedProducts[color];
    let selected = false;
    const someProductsSelected = products.some(({ id }) =>
      selectedResources.includes(id)
    );

    const allProductsSelected = products.every(({ id }) =>
      selectedResources.includes(id)
    );

    if (allProductsSelected) {
      selected = true;
    } else if (someProductsSelected) {
      selected = "indeterminate";
    }

    const rowRange = [
      rows.findIndex((row) => row.id === products[0].id),
      rows.findIndex((row) => row.id === products[products.length - 1].id),
    ];

    return (
      <Fragment key={productId}>
        <IndexTable.Row
          rowType="data"
          selectionRange={rowRange}
          id={`Parent-${index}`}
          position={position}
          selected={selected}
        >
          <IndexTable.Cell scope="col" id={productId}>
            <InlineStack gap="300" blockAlign="center">
              <img
                className="product-image"
                src={
                  products[0]?.parentImage?.src ||
                  "https://i.imgur.com/oUVyG2C.png"
                }
                alt="product-image"
              />
              <Text as="span" fontWeight="semibold">
                {products[0].parentTitle}
              </Text>
            </InlineStack>
          </IndexTable.Cell>
          <IndexTable.Cell />
          <IndexTable.Cell />
        </IndexTable.Row>
        {products.map(
          ({ id, title, inventory_quantity, price, position }, rowIndex) => (
            <IndexTable.Row
              rowType="child"
              key={rowIndex}
              id={id}
              position={position}
              selected={selectedResources.includes(id)}
            >
              <IndexTable.Cell
                scope="row"
                headers={`${columnHeadings[0].id} ${productId}`}
              >
                <Text variant="bodyMd" as="span">
                  {title}
                </Text>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <Text as="span" numeric>
                  {inventory_quantity > 0
                    ? `${inventory_quantity} available`
                    : "N/A"}
                </Text>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <Text as="span" numeric>
                  ${price}
                </Text>
              </IndexTable.Cell>
            </IndexTable.Row>
          )
        )}
      </Fragment>
    );
  });

  const handleAction = () => {
    const variantIdSet = new Set(selectedResources);
    const filteredData = rows.filter((item) => variantIdSet.has(item.id));
    const newData = convertData(
      filteredData,
      "product_id",
      (product_id) => product_id
    );
    setSelectedData(newData);
    setOpenModal(false);
  };

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      title="Select Products"
      size="large"
      primaryAction={{
        content: "Add",
        onAction: handleAction,
        id: "custom-add-btn",
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: () => setOpenModal(false),
          id: "custom-cancel-btn",
        },
        {
          content:
            selectedResources?.length > 0
              ? `${selectedResources.length} product selected`
              : "",
          onAction: () => {},
          id: "custom-selected-btn",
        },
      ]}
      onScrolledToBottom={() => {
        setPage((page) => page + 1);
      }}
    >
      <Modal.Section>
        <div className="search-product">
          <TextField
            placeholder="Search Products"
            prefix={<Icon source={SearchIcon} />}
            onChange={(val) => {
              setSearchValue(val);
            }}
            value={searchValue}
          />
        </div>
        <Divider />
        <LegacyCard>
          {loading ? (
            <TableSkelton />
          ) : (
            <IndexTable
              onSelectionChange={handleSelectionChange}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              itemCount={rows.length}
              headings={columnHeadings}
            >
              {rowMarkup}
            </IndexTable>
          )}
        </LegacyCard>
      </Modal.Section>
    </Modal>
  );
};

export default ProductTable;
