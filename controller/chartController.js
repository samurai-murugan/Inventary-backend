
const {getProducts,getProductsQunaityAndPrice,getPrdoductDetailforTimeLineCharts,getProductDetailForTimeLineChartsEveryHour} = require('../model/chartdb')

const getAllProducts = async (req, res) => {
  try {
    const result = await getProducts();
    res.json(result); 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error retrieving data' });
  }
};
// const getOrderDetail = async (req, res) => {
//   try {
//     const result = await getPrdoductDetailforTimeLineCharts();
//     console.log(result.created_date,"createdDAte"); 
//     res.json(result); 
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ message: 'Error retrieving data' });
//   }
// };

// const getOrderDetail = async (req, res) => {
//   try {
//     const result = await getPrdoductDetailforTimeLineCharts();
//    console.log("modi", result)
//     // Iterate through the result and modify created_date to local string format
//     const modifiedResult = result.map(item => {
//       const createdDate = new Date(item.created_date); // Parse the date
//       item.created_date = createdDate.toLocaleString(); // Convert it to local string format
//       return item;
//     });

//     console.log(modifiedResult); // Check the modified result
//     res.json(modifiedResult); // Send back the modified data
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ message: 'Error retrieving data' });
//   }
// };
const getOrderDetail = async (req, res) => {
  try {
    const result = await getPrdoductDetailforTimeLineCharts();
    console.log("modi", result);

    // // Format date as 'yyyy-MM-dd HH:mm'
    // const modifiedResult = result.map(item => {
    //   const createdDate = new Date(item.created_date); // Parse the date

    //   // Extract date components
    //   const year = createdDate.getFullYear();
    //   const month = String(createdDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    //   const day = String(createdDate.getDate()).padStart(2, '0');
    //   const hour = String(createdDate.getHours()).padStart(2, '0');
    //   const minute = String(createdDate.getMinutes()).padStart(2, '0');

    //   // Construct the formatted date string
    //   item.created_date = `${year}-${month}-${day} ${hour}:${minute}`;
    //   return item;
    // });

    // console.log(modifiedResult); // Check the modified result
    res.json(result); // Send back the modified data
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error retrieving data' });
  }
};


const getAllProductsQunaityAndPrice = async (req, res) => {
  try {
    const result = await getProductsQunaityAndPrice();

    res.json(result); 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error retrieving data' });
  }
};

const getAllProductsQunaityforEveryHour= async (req, res) => {
  try {
    const result = await getProductDetailForTimeLineChartsEveryHour();

    res.json(result); 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error retrieving data' });
  }
};

module.exports = {
    getAllProducts,
    getAllProductsQunaityAndPrice,
    getOrderDetail,
    getAllProductsQunaityforEveryHour
};
