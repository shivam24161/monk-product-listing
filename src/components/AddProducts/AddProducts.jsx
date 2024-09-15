import {
  BlockStack,
  Button,
  Collapsible,
  Divider,
  InlineGrid,
  InlineStack,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import React, { useContext, useState } from "react";
import { MyContext } from "../../context/Context";
import { XIcon } from "@shopify/polaris-icons";
import SortableList, { SortableItem, SortableKnob } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import { DragIcon, EditIcon } from "../../assests/Icon";
import CustomSelect from "../../utility/CustomSelect";
import CustomInput from "../../utility/CustomInput";
import ProductTable from "../ProductListing/ProductTable";
import "./AddProducts.css";

const AddProducts = () => {
  const { selectedData, setSelectedData, setOpenModal, setRemoveSelectedKey } =
    useContext(MyContext);
  const [prodDiscount, setProdDiscount] = useState([]);
  const [openAcc, setOpenAcc] = useState(new Set());
  const [draggable, setDraggable] = useState(true);

  const handleVariantDelete = (itemId, parentInd, childInd) => {
    let newData = [...selectedData];
    let items = [...newData[parentInd].items];
    let newChildItem = [...prodDiscount];
    let childItems = [...newChildItem[parentInd].items];
    newData[parentInd] = {
      ...newData[parentInd],
      items,
    };
    childItems.splice(childInd, 1);
    items.splice(childInd, 1);
    setProdDiscount(childItems);
    setRemoveSelectedKey([itemId]);
    setSelectedData(newData);
  };

  const handleProductDelete = (parentId) => {
    let newData = [...selectedData];
    let newProdData = [...prodDiscount];
    const removeKeys = newData[parentId].items.map((ele) => ele.id);
    newProdData.splice(parentId, 1);
    newData.splice(parentId, 1);
    setRemoveSelectedKey(removeKeys);
    setSelectedData(newData);
    setProdDiscount(newProdData);
  };

  const handleFields = (value, type = false, ind) => {
    const temp = [...prodDiscount];
    if (type) {
      temp[ind][type] = value;
      temp[ind] = {
        ...temp[ind],
        items: temp[ind]["items"].map((ele) => ({
          ...ele,
          [type]: temp[ind][type],
        })),
      };
    } else {
      temp[ind] = {
        disValue: 0,
        type: "",
        items: selectedData[ind].items.map((ele) => ({
          disValue: 0,
          type: "",
        })),
      };
    }
    setProdDiscount(temp);
  };

  const handleChildFields = (value, ind, childInd, type) => {
    let temp = [...prodDiscount];
    temp[ind].items[childInd][type] = value;
    setProdDiscount(temp);
  };

  const onSortEnd = (oldIndex, newIndex) => {
    setSelectedData((array) => arrayMoveImmutable(array, oldIndex, newIndex));
    setProdDiscount((array) => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  const onChildSortEnd = (parentIndex, oldIndex, newIndex) => {
    let temp = [...selectedData];
    temp[parentIndex] = {
      ...temp[parentIndex],
      items: arrayMoveImmutable(temp[parentIndex].items, oldIndex, newIndex),
    };
    let newChildItem = [...prodDiscount];
    if (newChildItem.length > 0) {
      newChildItem[parentIndex] = {
        ...newChildItem[parentIndex],
        items: arrayMoveImmutable(
          newChildItem[parentIndex].items,
          oldIndex,
          newIndex
        ),
      };
      setProdDiscount(newChildItem);
    }
    setSelectedData(temp);
  };

  const handleMoreProduct = () => {
    setSelectedData([
      ...selectedData,
      {
        key: selectedData.length,
        title: "",
        items: [],
      },
    ]);
  };

  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <BlockStack gap={"300"}>
            <Text variant="headingLg">Add Products</Text>
            <InlineGrid columns={["twoThirds", "oneThird"]}>
              <div className="select-product-text">
                <Text variant="bodyMd" fontWeight="bold">
                  Products
                </Text>
              </div>
              <Text variant="bodyMd" fontWeight="bold">
                Discounts
              </Text>
            </InlineGrid>
            <BlockStack gap={"400"}>
              {selectedData?.length === 0 ? (
                <InlineGrid columns={["twoThirds", "oneThird"]} gap={"300"}>
                  <InlineStack blockAlign="center" gap={"300"}>
                    <Text variant="bodyMd">1</Text>
                    <div className="flex-1">
                      <div className="custom-card">
                        <InlineStack gap={"300"} align="space-between">
                          <Text>Select Product</Text>
                          <span
                            className="c-pointer d-flex"
                            onClick={() =>
                              setOpenModal((openModal) => !openModal)
                            }
                          >
                            {EditIcon}
                          </span>
                        </InlineStack>
                      </div>
                    </div>
                  </InlineStack>
                  <button className="custom-btn">Add Discount</button>
                </InlineGrid>
              ) : (
                <SortableList
                  onSortEnd={onSortEnd}
                  className="list"
                  draggedItemClassName="dragged"
                  allowDrag={draggable && selectedData.length > 1}
                >
                  <BlockStack gap={"400"}>
                    {selectedData.map((item, index) => {
                      return (
                        <React.Fragment key={index}>
                          <SortableItem>
                            <div className="item">
                              <BlockStack gap={"400"}>
                                <InlineGrid
                                  columns={["twoThirds", "oneThird"]}
                                  gap={"300"}
                                >
                                  <InlineStack blockAlign="center" gap={"300"}>
                                    <InlineStack
                                      gap={"200"}
                                      blockAlign="center"
                                    >
                                      {selectedData.length > 1 && (
                                        <SortableKnob>
                                          <Button
                                            icon={DragIcon}
                                            variant="tertiary"
                                            id="custom-draggable"
                                          />
                                        </SortableKnob>
                                      )}
                                      <Text variant="bodyMd">{index + 1}</Text>
                                    </InlineStack>
                                    <div className="flex-1">
                                      <div className="custom-card">
                                        <InlineStack
                                          gap={"300"}
                                          align="space-between"
                                        >
                                          <Text
                                            fontWeight="medium"
                                            variant="bodyMd"
                                          >
                                            {item.title}
                                          </Text>
                                          <span
                                            className="c-pointer d-flex"
                                            onClick={() =>
                                              setOpenModal(
                                                (openModal) => !openModal
                                              )
                                            }
                                          >
                                            {EditIcon}
                                          </span>
                                        </InlineStack>
                                      </div>
                                    </div>
                                  </InlineStack>
                                  {prodDiscount[index] ? (
                                    <InlineGrid
                                      columns={["oneThird", "twoThirds"]}
                                      gap={"200"}
                                    >
                                      <CustomInput
                                        value={prodDiscount[index].disValue}
                                        onChange={(val) =>
                                          handleFields(val, "disValue", index)
                                        }
                                      />
                                      <InlineStack
                                        gap={"200"}
                                        wrap={false}
                                        align="space-between"
                                      >
                                        <CustomSelect
                                          value={prodDiscount[index].type}
                                          onChange={(selected) =>
                                            handleFields(
                                              selected,
                                              "type",
                                              index
                                            )
                                          }
                                        />
                                        <Button
                                          icon={XIcon}
                                          variant="tertiary"
                                          onClick={() =>
                                            handleProductDelete(index)
                                          }
                                        />
                                      </InlineStack>
                                    </InlineGrid>
                                  ) : (
                                    <button
                                      className="custom-btn"
                                      onClick={() =>
                                        handleFields("", "", index)
                                      }
                                    >
                                      Add Discount
                                    </button>
                                  )}
                                </InlineGrid>
                                {item.items.length !== 0 && (
                                  <BlockStack gap={"200"}>
                                    <InlineStack align="end">
                                      <Button
                                        variant="plain"
                                        disclosure={
                                          openAcc.has(index) ? "up" : "down"
                                        }
                                        onClick={() => {
                                          const newOpenAcc = new Set(openAcc);
                                          if (newOpenAcc.has(index)) {
                                            newOpenAcc.delete(index);
                                          } else {
                                            newOpenAcc.add(index);
                                          }
                                          setOpenAcc(newOpenAcc);
                                        }}
                                      >
                                        {openAcc.has(index) ? "Hide" : "Show"}{" "}
                                        Variants
                                      </Button>
                                    </InlineStack>
                                    <Collapsible
                                      open={openAcc.has(index)}
                                      id="basic-collapsible"
                                      transition={{
                                        duration: "500ms",
                                        timingFunction: "ease-in-out",
                                      }}
                                      expandOnPrint
                                    >
                                      <SortableList
                                        onSortEnd={(oldInd, newInd) =>
                                          onChildSortEnd(index, oldInd, newInd)
                                        }
                                        className="list"
                                        draggedItemClassName="dragged"
                                        onMouseEnter={() => setDraggable(false)}
                                        onMouseLeave={() => setDraggable(true)}
                                        allowDrag={item.items.length > 2}
                                      >
                                        <BlockStack gap={"200"} align="end">
                                          {item.items.map((child, childInd) => {
                                            return (
                                              <SortableItem key={childInd}>
                                                <div
                                                  key={childInd}
                                                  className="child-item"
                                                >
                                                  {item.items.length > 1 && (
                                                    <SortableKnob>
                                                      <Button
                                                        icon={DragIcon}
                                                        variant="tertiary"
                                                        id="custom-draggable"
                                                      />
                                                    </SortableKnob>
                                                  )}
                                                  <div className="custom-variant-card">
                                                    <Text fontWeight="medium">
                                                      {" "}
                                                      {child.title}
                                                    </Text>
                                                  </div>
                                                  {prodDiscount[index]
                                                    ?.items && (
                                                    <div className="custom-childInd-field">
                                                      <InlineGrid
                                                        columns={2}
                                                        gap={"200"}
                                                      >
                                                        <CustomInput
                                                          className="variant"
                                                          value={
                                                            prodDiscount[index]
                                                              ?.items[childInd]
                                                              ?.disValue
                                                          }
                                                          onChange={(val) =>
                                                            handleChildFields(
                                                              val,
                                                              index,
                                                              childInd,
                                                              "disValue"
                                                            )
                                                          }
                                                        />
                                                        <CustomSelect
                                                          className="variant"
                                                          value={
                                                            prodDiscount[index]
                                                              ?.items[childInd]
                                                              ?.type
                                                          }
                                                          onChange={(val) =>
                                                            handleChildFields(
                                                              val,
                                                              index,
                                                              childInd,
                                                              "type"
                                                            )
                                                          }
                                                        />
                                                      </InlineGrid>
                                                    </div>
                                                  )}
                                                  <Button
                                                    icon={XIcon}
                                                    variant="tertiary"
                                                    onClick={() =>
                                                      handleVariantDelete(
                                                        child.id,
                                                        index,
                                                        childInd
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </SortableItem>
                                            );
                                          })}
                                        </BlockStack>
                                      </SortableList>
                                    </Collapsible>
                                  </BlockStack>
                                )}
                              </BlockStack>
                            </div>
                          </SortableItem>
                          {selectedData.length - 1 !== index && <Divider />}
                        </React.Fragment>
                      );
                    })}
                  </BlockStack>
                </SortableList>
              )}
              <InlineStack align="end">
                <button
                  className="custom-btn-add"
                  onClick={handleMoreProduct}
                  disabled={
                    selectedData[selectedData.length - 1]?.title === "" ||
                    selectedData.length === 0
                  }
                >
                  Add Product
                </button>
              </InlineStack>
            </BlockStack>
          </BlockStack>
          <ProductTable />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default AddProducts;
