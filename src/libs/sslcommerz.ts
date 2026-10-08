export type SSLCommerzInitPayload = {
  total_amount: number;
  currency: 'BDT' | 'USD';
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  product_name: string;
  product_category: string;
  product_profile: 'general' | 'physical-goods' | 'non-physical-goods';
};

/**
 * Helper to initiate payment via SSLCommerz payment gateway.
 */
export async function initiateSSLCommerzPayment(payload: SSLCommerzInitPayload) {
  const isSandbox = process.env.SSLCOMMERZ_IS_SANDBOX === 'true';
  const initUrl = isSandbox
    ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
    : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

  const formData = new URLSearchParams();
  formData.append('store_id', process.env.STORE_ID || '');
  formData.append('store_passwd', process.env.STORE_PASSWORD || '');
  formData.append('total_amount', payload.total_amount.toString());
  formData.append('currency', payload.currency);
  formData.append('tran_id', payload.tran_id);
  formData.append('success_url', payload.success_url);
  formData.append('fail_url', payload.fail_url);
  formData.append('cancel_url', payload.cancel_url);
  formData.append('cus_name', payload.customer_name);
  formData.append('cus_email', payload.customer_email);
  formData.append('cus_phone', payload.customer_phone);
  formData.append('cus_add1', 'Dhaka'); // Dummy default address fields required by SSLCommerz
  formData.append('cus_city', 'Dhaka');
  formData.append('cus_country', 'Bangladesh');
  formData.append('shipping_method', 'NO');
  formData.append('num_of_item', '1');
  formData.append('product_name', payload.product_name);
  formData.append('product_category', payload.product_category);
  formData.append('product_profile', payload.product_profile);

  try {
    const response = await fetch(initUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (data.status === 'SUCCESS') {
      return {
        success: true,
        gatewayUrl: data.GatewayPageURL,
        sessionkey: data.sessionkey,
      };
    } else {
      console.error('SSLCommerz Initialization Failed:', data.failedreason || data);
      return {
        success: false,
        error: data.failedreason || 'Initialization failed',
      };
    }
  } catch (error: any) {
    console.error('SSLCommerz Request Error:', error);
    return {
      success: false,
      error: error.message || 'Request failed',
    };
  }
}
