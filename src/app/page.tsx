"use client";
import { useState, useEffect } from "react";
export default function Home() {
  const [platform, setPlatform] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [productCost, setProductCost] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [adsCost, setAdsCost] = useState("");
  const [targetMargin, setTargetMargin] = useState("20");
  const [bulkResults, setBulkResults] = useState<any[]>([]);
  const [isPro, setIsPro] = useState(false);
  const platforms = [

    { name: "Trendyol", rate: 21 },
    { name: "Hepsiburada", rate: 18 },
    { name: "n11", rate: 20 },
    { name: "Amazon", rate: 15 },
    { name: "Etsy", rate: 6.5 },
    { name: "Shopify", rate: 2 },
    { name: "ÇiçekSepeti", rate: 18 },
    { name: "Pazarama", rate: 15 },
    { name: "PTTAVM", rate: 15 },
  ];
  const platformData = {
    trendyol: {
      rate: 21,
      payout: "14-21 gün",
      note: "Teslim + iade süresi sonrası"
    },
    hepsiburada: {
      rate: 18,
      payout: "7-14 gün",
      note: "Teslim + iade süresi sonrası"
    },
    n11: {
      rate: 20,
      payout: "7-14 gün",
      note: "Teslim sonrası"
    },
    amazon: {
      rate: 15,
      payout: "14 gün",
      note: "Periyot bazlı ödeme"
    },
    etsy: {
      rate: 6.5,
      payout: "3-5 gün",
      note: "Hesap durumuna göre değişir"
    },
    shopify: {
      rate: 2,
      payout: "1-3 gün",
      note: "Banka ve ülkeye göre değişir"
    },
  };
  const [showLanding, setShowLanding] = useState(true);
  const [profit, setProfit] = useState<number | null>(null);
  const [margin, setMargin] = useState<number | null>(null);
  const [advice, setAdvice] = useState("");
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [netRevenue, setNetRevenue] = useState<number>(0);
  const [desi, setDesi] = useState("");
  const [calculatedShipping, setCalculatedShipping] = useState<number | null>(null);
  const [kdvRate, setKdvRate] = useState("0");



  function handlePlatformChange(value: string) {
    setPlatform(value);

    if (value === "trendyol") setCommissionRate("21");
    if (value === "hepsiburada") setCommissionRate("18");
    if (value === "n11") setCommissionRate("20");
    if (value === "amazon") setCommissionRate("15");
    if (value === "etsy") setCommissionRate("6.5");
    if (value === "shopify") setCommissionRate("2");
    if (value === "ciceksepeti") setCommissionRate("18");
    if (value === "pazarama") setCommissionRate("15");
    if (value === "pttavm") setCommissionRate("15");
  }

  function calculateProfit() {

    if (
      !salePrice ||
      !productCost ||
      !shippingCost ||
      !commissionRate ||
      !adsCost
    ) {
      return;
    }





    const sale = parseFloat(salePrice.replace(",", "."));
    const product = parseFloat(productCost.replace(",", "."));
    const shipping = parseFloat(shippingCost.replace(",", "."));
    const commissionRateNum = parseFloat(commissionRate.replace(",", "."));
    const ads = parseFloat(adsCost.replace(",", "."));

    const commission = sale * (commissionRateNum / 100);
    setNetRevenue(sale - commission - shipping);
    const netRevenue = sale - commission;
    const maxMargin = 100 - commissionRateNum;

    const netProfit = sale - product - shipping - commission - ads;

    const kdvRateNum = parseFloat(kdvRate);

    let netProfitAfterTax = netProfit;

    if (kdvRateNum > 0) {
      const kdv = netProfit * (kdvRateNum / 100);
      netProfitAfterTax = netProfit - kdv;
    }

    const profitMargin = sale === 0 ? 0 : (netProfit / sale) * 100;

    const targetMarginNum = parseFloat(targetMargin);
    if (1 - commissionRateNum / 100 - targetMarginNum / 100 <= 0) {
      setAdvice("Seçtiğiniz hedef kâr marjı bu platform komisyonu ile mümkün değil.");
      setSuggestedPrice(null);
      return;
    }

    if (targetMarginNum > 0) {
      const totalCost = product + shipping + ads;
      const commissionRateDecimal = commissionRateNum / 100;

      const suggested =
        totalCost /
        (1 - commissionRateDecimal - targetMarginNum / 100);

      setSuggestedPrice(suggested);
    }

    let advice = "";

    if (profitMargin < 10) {
      advice = "Kâr marjınız çok düşük. Fiyat artırın ya da maliyet düşürün";
    } else if (profitMargin < 20) {
      advice = "Kâr marjınız orta seviyede. Maliyetlerinizi optimize edin.";
    } else {
      advice = "Kâr marjınız iyi görünüyor.";
    }


    setProfit(netProfitAfterTax);
    setMargin(profitMargin);
    setAdvice(advice);

    if (profitMargin >= targetMarginNum) {
      setSuggestedPrice(null);
    }

  } useEffect(() => {
    if (
      !salePrice ||
      !productCost ||
      !shippingCost ||
      !commissionRate ||
      !adsCost
    ) {
      return;
    }

    calculateProfit();

  }, [
    salePrice,
    productCost,
    shippingCost,
    commissionRate,
    adsCost,
    targetMargin,
    kdvRate
  ]);
  function resetForm() {
    setPlatform("");
    setSalePrice("");
    setProductCost("");
    setShippingCost("");
    setCommissionRate("");
    setAdsCost("");
    setTargetMargin("20");

    setProfit(null);
    setMargin(null);
    setAdvice("");
    setSuggestedPrice(null);
  }
  function calculateCargoByDesi(desiValue: string) {
    const d = parseFloat(desiValue.replace(",", "."));

    if (!d || d <= 0) {
      setCalculatedShipping(null);
      return;
    }

    let cost = 0;

    if (d <= 2) cost = 75;
    else if (d <= 4) cost = 95;
    else if (d <= 6) cost = 110;
    else if (d <= 10) cost = 130;
    else if (d <= 15) cost = 170;
    else if (d <= 20) cost = 210;
    else cost = 210 + (d - 20) * 12;

    setCalculatedShipping(cost);
  }
  function handleCSVUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;

      const rows = text.split("\n").slice(1); // başlık satırını atla

      const results = rows.map((row) => {
        const [sale, product, shipping, commission, ads] = row.split(",");

        const saleNum = parseFloat(sale);
        const productNum = parseFloat(product);
        const shippingNum = parseFloat(shipping);
        const commissionNum = parseFloat(commission);
        const adsNum = parseFloat(ads);

        const commissionCost = saleNum * (commissionNum / 100);

        const net =
          saleNum - productNum - shippingNum - commissionCost - adsNum;

        const margin = (net / saleNum) * 100;


        return {

          sale: saleNum,
          netProfit: net,
          margin: margin,
        };
      });

      setBulkResults(results);
    };

    reader.readAsText(file);
  }
  function cleanNumberInput(value: string) {
    return value.replace(/[^0-9.,]/g, "");
  }
  function calculateForPlatform(rate: number) {
    const sale = parseFloat(salePrice.replace(",", "."));
    const product = parseFloat(productCost.replace(",", "."));
    const shipping = parseFloat(shippingCost.replace(",", "."));
    const ads = parseFloat(adsCost.replace(",", "."));

    const commission = sale * (rate / 100);
    const netProfit = sale - product - shipping - commission - ads;
    const margin = sale === 0 ? 0 : (netProfit / sale) * 100;

    return { netProfit, margin };
  }
  const allResults = platforms.map(p => ({
    name: p.name,
    ...calculateForPlatform(p.rate)
  }));


  return (

    <main className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center p-4">
      {showLanding && (
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">
            E-ticarette gerçekten kâr ediyor musun?
          </h1>

          <p className="text-gray-600 mt-2">
            MarginLab ile saniyeler içinde kârını hesapla.
          </p>

          <button
            onClick={() => setShowLanding(false)}
            className="mt-4 bg-black text-white px-6 py-3 rounded-lg"
          >
            Hemen Hesapla
          </button>
        </div>
      )}

      {/* SOL: FORM KARTI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl">
        <div className="bg-white shadow-lg rounded-xl p-8">

          <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">
            MarginLab
          </h1>

          <h2 className="text-lg text-gray-600 mb-6 text-center">
            Satış yapıyor olabilirsiniz ama gerçekten kâr ediyor musunuz?
          </h2>

          <div>
            <label className="text-sm font-medium">Platform</label>

            <select
              value={platform}
              onChange={(e) => handlePlatformChange(e.target.value)}
              className="border p-2 rounded w-full">
              <option value="">Platform seç</option>
              <option value="trendyol">Trendyol</option>
              <option value="hepsiburada">Hepsiburada</option>
              <option value="n11">n11</option>
              <option value="amazon">Amazon</option>
              <option value="etsy">Etsy</option>
              <option value="shopify">Shopify</option>
              <option value="ciceksepeti">ÇiçekSepeti</option>
              <option value="pazarama">Pazarama</option>
              <option value="pttavm">PTTAVM</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

            <div>
              <label className="text-sm font-medium">Satış fiyatı</label>
              <input
                className="border p-2 rounded w-full"
                placeholder="Örn: 99.90"
                value={salePrice}
                onChange={(e) => setSalePrice(cleanNumberInput(e.target.value))} />
            </div>

            <div>
              <label className="text-sm font-medium">Ürün maliyeti</label>
              <input
                className="border p-2 rounded w-full"
                placeholder="Örn: 99.90"
                value={productCost}
                onChange={(e) => setProductCost(cleanNumberInput(e.target.value))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Kargo maliyeti</label>
              <input
                className="border p-2 rounded w-full"
                placeholder="Örn: 99.90"
                value={shippingCost}
                onChange={(e) => setShippingCost(cleanNumberInput(e.target.value))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Komisyon (%)</label>
              <input
                className="border p-2 rounded w-full"
                placeholder="Örn: 99.90"
                value={commissionRate}
                onChange={(e) => setCommissionRate(cleanNumberInput(e.target.value))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Reklam maliyeti</label>
              <input
                className="border p-2 rounded w-full"
                placeholder="Örn: 99.90"
                value={adsCost}
                onChange={(e) => setAdsCost(cleanNumberInput(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">KDV</label>

              <select
                value={kdvRate}
                onChange={(e) => setKdvRate(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="0">KDV yok</option>
                <option value="1">%1</option>
                <option value="10">%10</option>
                <option value="20">%20</option>
              </select>
              {kdvRate !== "0" && (
                <p className="text-xs text-gray-400 mt-1">
                  KDV düşüldükten sonra net kâr hesaplanır.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">
                Hedef kâr marjı (%)
              </label>

              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={targetMargin}
                onChange={(e) => setTargetMargin(e.target.value)}
                className="w-full mt-2"
              />

              <p className="text-sm text-gray-600">
                Seçilen hedef: %{targetMargin}
              </p>
            </div>
            <button
              onClick={resetForm}
              className="w-full mt-2 bg-gray-800 text-white py-3 rounded-lg font-medium"
            >
              Sıfırla
            </button>

          </div>
          <div className="mt-6 p-4 border rounded-xl bg-gray-50 shadow-sm">

            <p className="text-sm font-semibold">
              📦 Kargo Maliyeti Hesapla (Desi)
            </p>
            <p className="text-xs text-red-600 mt-2 font-medium">
              ⚠️ Kargo gideri ilgili platform tarafından hesabınıza aktarılacak tutardan otomatik düşülür.
            </p>


            <p className="text-xs text-gray-500 mt-1">
              Desi girerek pazaryerlerinde ki ortalama kargo maliyetinizi hesaplayabilirsiniz.
            </p>

            <input
              type="text"
              value={desi}
              onChange={(e) => {
                setDesi(e.target.value);
                calculateCargoByDesi(e.target.value);
              }}
              placeholder="Örn: 3"
              className="border p-2 rounded w-full mt-2"
            />

            {calculatedShipping !== null && (
              <>
                <p className="text-sm mt-2 font-medium text-green-600">
                  Tahmini kargo: {calculatedShipping.toFixed(2)} TL
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Kargo ücretleri platform ve anlaşmaya göre değişebilir. Bu hesaplama ortalama değerler içerir.
                </p>

                <button
                  onClick={() => setShippingCost(calculatedShipping.toFixed(2))}
                  className="mt-2 text-sm bg-indigo-600 px-4 py-2 text-white px-3 py-1 rounded"
                >
                  Bu miktarı kargo maliyetine ekle
                </button>
              </>
            )}

          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">




          </div>

          <div className="mt-6">
            <label className="text-sm font-medium">
              Toplu ürün kâr analizi
            </label>

            <p className="text-xs text-gray-500 mt-1">
              Birden fazla ürünü tek seferde analiz etmek için CSV dosyası yükleyin.
            </p>

            {isPro ? (
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="border p-2 rounded w-full mt-2"
              />
            ) : (
              <button
                onClick={() => alert("Pro sürüm yakında")}
                className="bg-yellow-400 w-full p-2 rounded mt-2"
              >
                🔒 CSV analizi için Pro'ya geç
              </button>
            )}

            <p className="text-xs text-gray-400 mt-1">
              Sütunlar: satış fiyatı, ürün maliyeti, kargo, komisyon (%), reklam maliyeti
            </p>

            <a
              href="/ornek-urunler.csv"
              download
              className="text-xs text-blue-600 underline mt-1 inline-block"
            >
              Örnek CSV indir
            </a>

          </div>

        </div>

        {/* SAĞ: SONUÇ PANELİ */}
        <div className="sticky top-4 h-fit">

          {profit !== null && (
            <div className={`bg-white shadow-md rounded-2xl p-5 border ${profit < 0 ? "border-red-200" : "border-gray-200"
              }`}>


              {/* ÜST BAR */}
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl mb-4"></div>

              {/* NET KAR */}
              <p className="text-sm text-gray-500">Net Kâr</p>

              <p className="text-2xl font-semibold">
                {profit.toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} TL
              </p>

              {/* MARJ */}
              <p className={`text-lg font-semibold mt-2 ${margin !== null && margin < 10
                ? "text-red-500"
                : margin !== null && margin < 20
                  ? "text-orange-500"
                  : "text-green-600"
                }`}>
                Kâr Marjı: {margin?.toFixed(2)}%
              </p>

              {/* YORUM */}
              <p className="text-sm text-gray-600 mt-2">

                {advice}
              </p>
              <div className={`mt-4 p-4 rounded-lg border ${profit !== null && profit < 0
                ? "bg-red-50 border-red-200"
                : "bg-green-100 border-green-300"
                }`}>

                <p className="text-sm text-gray-600">
                  Platformdan Hesabınıza Aktarılacak Tahmini Tutar
                </p>

                <p className="text-xl font-bold text-green-800 mt-1">
                  💰 {netRevenue.toFixed(2)} TL
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  ⏱ Ödeme süresi: {platformData[platform as keyof typeof platformData]?.payout}
                </p>

                <p className="text-xs text-gray-400">
                  Sipariş teslim edildikten ve iade süresi tamamlandıktan sonra hesabınıza aktarılır.
                </p>

              </div>






              {/* MAX KAR MARJI */}
              <p className="text-xs text-gray-500 mt-2">
                Bu platformda maksimum kâr marjı: %{
                  commissionRate
                    ? (100 - parseFloat(commissionRate.replace(",", "."))).toFixed(0)
                    : "0"
                }
              </p>




              {/* AYRAÇ */}
              <div className="border-t my-4"></div>

              {/* DETAY */}
              <div className="text-sm space-y-1">
                <p>Satış fiyatı: {salePrice} TL</p>
                <p>Ürün maliyeti: -{productCost} TL</p>

                <p>
                  Komisyon: -{(
                    parseFloat(salePrice.replace(",", ".")) *
                    (parseFloat(commissionRate.replace(",", ".")) / 100)
                  ).toFixed(2)} TL
                </p>

                <p>Kargo: -{shippingCost} TL</p>
                <p>Reklam: -{adsCost} TL</p>


              </div>

              {/* ÖNERİLEN FİYAT */}
              {suggestedPrice !== null && (
                <p className="text-sm mt-4 font-medium text-blue-600">
                  Hedef kâr marjı için önerilen satış fiyatı: {suggestedPrice.toFixed(2)} TL
                </p>
              )}

              {/* PLATFORM KARŞILAŞTIRMA */}
              <div className="mt-6 bg-white rounded-xl p-3">
                <h3 className="font-semibold mb-2 text-gray-800">
                  Platformlara Göre Net Kâr
                </h3>

                {platforms.map((p, i) => {
                  const result = calculateForPlatform(p.rate);

                  return (
                    <div
                      key={i}
                      className="flex justify-between items-center py-3 border-b border-gray-200"
                    >
                      <span className="text-sm text-gray-700">
                        {p.name}
                      </span>

                      <span
                        className={`text-sm font-semibold ${result.netProfit < 0
                          ? "text-red-600"
                          : "text-green-600"
                          }`}
                      >
                        {result.netProfit.toFixed(2)} TL
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* CSV SONUÇ */}
              {bulkResults.length > 0 && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Toplu analiz sonuçları</h3>

                  {bulkResults.map((item, i) => (
                    <div key={i} className="text-sm border-b py-1">
                      Satış: {item.sale} TL | Net Kâr: {item.netProfit.toFixed(2)} TL | Marj: {item.margin.toFixed(2)}%
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </main>
  );
}