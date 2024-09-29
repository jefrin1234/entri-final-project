const Sales = require("../../model/salesModel");


const sales = async (req, res, next) => {
  try {
   
    const totalRevenue = await Sales.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$saleAmount" }
        }
      }
    ]);

    
    const yearlySales = await Sales.aggregate([
      {
        $group: {
          _id: { year: { $year: "$dateOfSale" } },
          totalSales: { $sum: "$saleAmount" }, 
          totalQuantity: { $sum: "$quantity" }
        }
      },
      { $sort: { "_id.year": 1 } } 
    ]);

    const monthlySales = await Sales.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$dateOfSale" }, 
            month: { $month: "$dateOfSale" } 
          },
          totalSales: { $sum: "$saleAmount" }, 
          totalQuantity: { $sum: "$quantity" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

   
    const dailySales = await Sales.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$dateOfSale" },
            month: { $month: "$dateOfSale" },
            year: { $year: "$dateOfSale" }
          },
          totalSales: { $sum: "$saleAmount" },
          totalQuantity: { $sum: "$quantity" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    const topSellingProducts = await Sales.aggregate([
      {
        $group: {
          _id: "$productId",
          totalQuantity: { $sum: "$quantity" },
          totalSales: { $sum: "$saleAmount" }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind: "$productDetails"
      },
      {
        $project: {
          productId: "$_id",
          productName: "$productDetails.name",
          totalQuantity: 1,
          totalSales: 1
        }
      }
    ]);

    res.json({
      message: "Sales data",
      error: false,
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.totalRevenue || 0,
        yearlySales, 
        monthlySales,
        dailySales, 
        topSellingProducts 
      }
    });

  } catch (error) {
    console.error("Error fetching sales data:", error);
    next(error); 
  }
};


module.exports = sales;
