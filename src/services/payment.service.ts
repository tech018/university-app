// import {ValidatedRequest} from 'express-joi-validation';
// import {Response} from 'express';
// import {
//   ApprovedPaymentRequestSchema,
//   PaymentRequestSchema,
// } from '../schema/payment';
// import generators from '../generator/genetator';
// import paypal from 'paypal-rest-sdk';
// import Applications from '../models/application';

// import httpStatus from 'http-status';
// import config from '../config';

// paypal.configure({
//   mode: config.paypal.mode, //sandbox or live
//   client_id: config.paypal.clientId,
//   client_secret: config.paypal.clientSecret,
// });

// export const paymentPaypalService = async (
//   req: ValidatedRequest<PaymentRequestSchema>,
//   res: Response,
// ) => {
//   try {
//     const {name, price, desc} = req.body;

//     const create_payment_json = {
//       intent: 'sale',
//       payer: {
//         payment_method: 'paypal',
//       },
//       redirect_urls: {
//         return_url: 'SUCCESSPAYMENTSCREEN',
//         cancel_url: 'CANCELPAYMENTSCREEN',
//       },
//       transactions: [
//         {
//           item_list: {
//             items: [
//               {
//                 name: name,
//                 sku: `SKU-${generators.ramdomString(10)}`,
//                 price: price,
//                 currency: 'USD',
//                 quantity: 1,
//               },
//             ],
//           },
//           amount: {
//             currency: 'USD',
//             total: price,
//           },
//           description: desc,
//         },
//       ],
//     };

//     paypal.payment.create(create_payment_json, function (error, payment) {
//       if (error) {
//         res.status(400).json({message: error});
//       } else {
//         res.status(200).json(payment);
//       }
//     });
//   } catch (error) {
//     res.status(500).json({message: 'Internal server error'});
//   }
// };

// async function PaymentSuccess(res: Response, email: string, appId: number) {
//   const application = await Applications.findOne(
//     {_id: appId, email},
//     {dateOfPayment: Date.now(), appStatus: 'approved'},
//   );
//   if (application) {
//     return res.status(200).json({message: 'Successfully paid'});
//   }
//   return res.status(400).json({message: 'Something wrong in your request'});
// }

// export const approvedPaypalService = async (
//   req: ValidatedRequest<ApprovedPaymentRequestSchema>,
//   res: Response,
// ) => {
//   try {
//     const {payerId, paymentId, total, email, appId} = req.query;

//     const execute_payment_json = {
//       payer_id: payerId,
//       transactions: [
//         {
//           amount: {
//             currency: 'USD',
//             total: total,
//           },
//         },
//       ],
//     };

//     paypal.payment.execute(
//       paymentId,
//       execute_payment_json,
//       function async(error, payment) {
//         if (error) {
//           console.log(error);
//           if (error.httpStatusCode === 400) {
//             return res
//               .status(httpStatus.BAD_REQUEST)
//               .json({message: 'The application has already purchased'});
//           }
//           return res.status(httpStatus.BAD_REQUEST).json({message: error});
//         } else {
//           if (payment) {
//             PaymentSuccess(res, email, appId);
//           }
//         }
//       },
//     );
//   } catch (error) {
//     console.log('payment approval error', error);
//     res
//       .status(httpStatus.INTERNAL_SERVER_ERROR)
//       .json({message: 'Internal server error'});
//   }
// };
