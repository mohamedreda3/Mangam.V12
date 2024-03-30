  // async edit(data) {
  //   const offer = await doQuery("SELECT * FROM offers WHERE id = ?", [
  //     data?.offer_id,
  //   ]);
  //   if (!offer || !offer?.length) {
  //     return { status: 0, message: "Offer Not Found in this store" };
  //   }
  //   const product = await doQuery("SELECT * FROM product WHERE id = ?", [
  //     data?.product_id,
  //   ]);
  //   if (!product || !product?.length) {
  //     return { status: 0, message: "Product Not Found" };
  //   }
  //   const productStore = product[0]?.store?.split("***");
  //   const offerStore = data?.store?.split("***");
  //   let NotFoundStore = [];
  //   let found = true;
  //   for (let i = 0; i < offerStore.length; i++) {
  //     let item = offerStore[i];
  //     found = false;
  //     for (let j = 0; j < productStore.length; j++) {
  //       let ps_item = productStore[j];
  //       if (item == ps_item) {
  //         found = true;
  //         break;
  //       }
  //     }

  //     if (!found) {
  //       NotFoundStore.push(item);
  //       break;
  //     }
  //   }
  //   if (!found) {
  //     return {
  //       status: 0,
  //       message:
  //         "Product Not Found In This Stores: (" +
  //         NotFoundStore?.join(" - ") +
  //         ") ---The Product is Available only on : " +
  //         productStore?.join(" - "),
  //     };
  //   }
  //   let varients = data?.varients?.split("***");
  //   let offerProductsDetails = varients?.map((item) => {
  //     return {
  //       color_id: item?.split("*")[0],
  //       color_plus_price: item?.split("*")[1],
  //       prop_id: item?.split("*")[2],
  //       prop_value_id: item?.split("*")[3],
  //       av_quantity: item?.split("*")[4],
  //       prop_plus_price: item?.split("*")[5],
  //     };
  //   });
  //   if (offerProductsDetails && offerProductsDetails.length) {
  //     let colors = [];
  //     let props = [];
  //     let props_values = [];
  //     for (let i = 0; i < offerProductsDetails.length; i++) {
  //       let item = offerProductsDetails[i];
  //       const color = await doQuery(
  //         "SELECT * FROM colors WHERE id = ? AND product_id = ?",
  //         [item?.color_id, data?.product_id]
  //       );
  //       colors.push(color[0]);
  //       if (!color || !color?.length) {
  //         colors = [];
  //         break;
  //       }
  //       if (item?.prop_id) {
  //         const prop = await doQuery(
  //           "SELECT * FROM product_props WHERE id = ? AND color_id = ?",
  //           [item?.prop_id, item?.color_id]
  //         );
  //         props.push(prop[0]);
  //         if (!prop || !prop?.length) {
  //           props = [];
  //           break;
  //         }
  //         const prop_value = await doQuery(
  //           "SELECT * FROM product_props_value WHERE id = ? AND prop_id = ?",
  //           [item?.prop_value_id, item?.prop_id]
  //         );
  //         props_values.push(prop_value[0]);
  //         if (!prop_value || !prop_value?.length) {
  //           props_values = [];
  //           break;
  //         }
  //       }
  //     }
  //   }
  //   if (!colors || !colors?.length) {
  //     return { status: 0, message: "Color Not Found In This Product" };
  //   }

  //   if (!props || !props?.length) {
  //     return { status: 0, message: "Prop Not Found In This Color" };
  //   }
  //   if (!props_values || !props_values?.length) {
  //     return { status: 0, message: "Prop Value Not Found In This Prop" };
  //   }

  //   if (
  //     moment(data?.will_av_after).diff(moment()) <= 0 ||
  //     moment(data?.will_av_for).diff(moment()) <= 0 ||
  //     moment(data?.will_av_after).diff(moment()) >=
  //       moment(data?.will_av_for).diff(moment())
  //   ) {
  //     return { status: 0, message: "Error In Offer Time" };
  //   }

  //   const updateOffer = await doQuery(
  //     "UPDATE offers SET product_id=?, store=?, varients=?, will_av_after=?, will_av_for=? WHERE id = ?",
  //     [
  //       data?.product_id ? data?.product_id : offer[0]?.product_id,
  //       data?.store ? data?.store : offer[0]?.store,
  //       data?.varients
  //         ? JSON.stringify(offerProductsDetails)
  //         : offer[0]?.varients,

  //       data?.will_av_after ? data?.will_av_after : offer[0]?.will_av_after,
  //       data?.will_av_for ? data?.will_av_for : offer[0]?.will_av_for,

  //       data?.offer_id,
  //     ]
  //   );

  //   if (updateOffer?.changedRows) {
  //     return { status: 1, message: "Offer Editted" };
  //   } else {
  //     return { status: 0, message: "Offer Not Editted" };
  //   }
  // }