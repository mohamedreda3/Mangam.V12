const doQuery = require("../../config/doQuery");
const ProductRepository = require("../product");
const productRepository = new ProductRepository();
const Group = require("../../functions/groupProducts");
const ExcelJS = require("exceljs");
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("My Worksheet");
module.exports = class {
  constructor() {}
  async getAll(req, res, type) {
    const infos = await doQuery("SELECT * FROM info");
    return { infos };
  }

  async edit_info(data) {
    const infoOldData = await doQuery("SELECT * FROM info WHERE id = 1");
    if (!infoOldData || !infoOldData.length) {
      return { affectedRows: 0 };
    }

    const update = await doQuery(
      "UPDATE info SET name = ?, logo = ?, email=?, address = ?, phone = ?, tax = ?, terms = ?, policy = ?, return_policy = ?,policy_ar = ?, return_policy_ar = ?, terms_ar = ?, conditions_ar = ?, name_ar=?, conditions = ?, about=?, about_ar=?",
      [
        data?.name ? data.name : infoOldData[0]?.name,
        data?.logo ? data.logo : infoOldData[0]?.logo,
        data?.email ? data.email : infoOldData[0]?.email,
        data?.address ? data.address : infoOldData[0]?.address,
        data?.phone ? data.phone : infoOldData[0]?.phone,
        data?.tax ? data.tax : infoOldData[0]?.tax,
        data?.terms ? data.terms : infoOldData[0]?.terms,
        data?.policy ? data.policy : infoOldData[0]?.policy,
        data?.return_policy
          ? data.return_policy
          : infoOldData[0]?.return_policy,
        data?.policy_ar ? data.policy_ar : infoOldData[0]?.policy_ar,
        data?.return_policy_ar
          ? data.return_policy_ar
          : infoOldData[0]?.return_policy_ar,
        data?.terms_ar ? data.terms_ar : infoOldData[0]?.terms_ar,
        data?.conditions_ar
          ? data.conditions_ar
          : infoOldData[0]?.conditions_ar,
        data?.conditions ? data.conditions : infoOldData[0]?.conditions,
        data?.name_ar ? data.name_ar : infoOldData[0]?.name_ar,
        data?.about ? data.about : infoOldData[0]?.about,
        data?.about_ar ? data.about_ar : infoOldData[0]?.about_ar
      ]
    );

    // console.log(update);

    return update;
  }

  async stats(type, dataName, res) {
    if (type != "admin") {
      return { status: 0, message: "You Are Not authorized" };
    }

    const allOrders = await doQuery("SELECT * from orders");
    const pendingOrders = await doQuery(
      "SELECT * from orders WHERE status = ?",
      ["pending"]
    );
    const completedOrders = await doQuery(
      "SELECT * from orders WHERE status = ?",
      ["completed"]
    );
    const canceledOrders = await doQuery(
      "SELECT * from orders WHERE status = 'canceled'",
      ["canceled"]
    );

    const allReturns = await doQuery("SELECT * from returns");
    const pendingreturns = await doQuery(
      "SELECT * from returns WHERE status = ?",
      ["return requested"]
    );
    const approvedReturns = await doQuery(
      "SELECT * from returns WHERE status = ?",
      ["out for delivery"]
    );
    const rejectedReturns = await doQuery(
      "SELECT * from returns WHERE status = ?",
      ["Return Confirmed"]
    );
    return {
      status: 1,
      message: {
        ordersStats: {
          canceledOrders: {
            number: canceledOrders.length,
            percentage:
              parseFloat(
                parseFloat(canceledOrders.length / allOrders.length).toFixed(4)
              ) * 100
          },
          completedOrders: {
            number: completedOrders.length,
            percentage:
              parseFloat(
                parseFloat(completedOrders.length / allOrders.length).toFixed(4)
              ) * 100
          },
          pendingOrders: {
            number: pendingOrders.length,
            percentage:
              parseFloat(
                parseFloat(pendingOrders.length / allOrders.length).toFixed(4)
              ) * 100
          },
          allOrders: {
            number: allOrders.length,
            percentage:
              parseFloat(
                parseFloat(allOrders.length / allOrders.length).toFixed(4)
              ) * 100
          }
        },
        returnsStats: {
          rejectedReturns: {
            number: rejectedReturns.length,
            percentage:
              parseFloat(
                parseFloat(rejectedReturns.length / allReturns.length).toFixed(
                  4
                )
              ) * 100
          },
          approvedReturns: {
            number: approvedReturns.length,
            percentage:
              parseFloat(
                parseFloat(approvedReturns.length / allReturns.length).toFixed(
                  4
                )
              ) * 100
          },
          pendingreturns: {
            number: pendingreturns.length,
            percentage:
              parseFloat(
                parseFloat(pendingreturns.length / allReturns.length).toFixed(4)
              ) * 100
          },
          allReturns: {
            number: allReturns.length,
            percentage:
              parseFloat(
                parseFloat(allReturns.length / allReturns.length).toFixed(4)
              ) * 100
          }
        }
      }
    };
  }
};
