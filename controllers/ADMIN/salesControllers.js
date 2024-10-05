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



    res.json({
      message: "Sales data",
      error: false,
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.totalRevenue || 0,
        yearlySales, 
        monthlySales,
        dailySales, 
       
      }
    });

  } catch (error) {
    console.error("Error fetching sales data:", error);
    next(error); 
  }
};


module.exports = sales;
