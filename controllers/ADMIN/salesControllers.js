const Sales = require("../../model/salesModel");


const sales = async (req, res, next) => {
  try {
    // Fetch total revenue
    const totalRevenue = await Sales.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$saleAmount" }
        }
      }
    ]);

    // Fetch yearly sales data
    const yearlySales = await Sales.aggregate([
      {
        $group: {
          _id: { year: { $year: "$dateOfSale" } }, // Group by year
          totalSales: { $sum: "$saleAmount" }, // Sum of sales amount
          totalQuantity: { $sum: "$quantity" } // Sum of quantities
        }
      },
      { $sort: { "_id.year": 1 } } // Sort by year
    ]);

    // Fetch monthly sales data
    const monthlySales = await Sales.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$dateOfSale" }, // Group by year
            month: { $month: "$dateOfSale" } // Group by month
          },
          totalSales: { $sum: "$saleAmount" }, // Sum of sales amount
          totalQuantity: { $sum: "$quantity" } // Sum of quantities
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } } // Sort by year and month
    ]);

    // Fetch daily sales data (already implemented)
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

    // Fetch top-selling products (already implemented)
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
        yearlySales, // Return the yearly sales data
        monthlySales, // Return the monthly sales data
        dailySales, // Return the daily sales data
        topSellingProducts // Return the top-selling products data
      }
    });

  } catch (error) {
    console.error("Error fetching sales data:", error);
    next(error); // Pass the error to the next middleware for handling
  }
};


module.exports = sales;
