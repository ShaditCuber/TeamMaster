// import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
// import Loader from "../components/Loader/Loader";
// import { useCompetitions } from "../queries/competitions";
// import { useTranslation } from "react-i18next";

// const ScoreCard = () => {
//     const { data, isLoading } = useCompetitions();
//     const { t } = useTranslation("global");

//     if (isLoading) {
//         return <Loader />;
//     }

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         const day = String(date.getDate()).padStart(2, "0");
//         const month = String(date.getMonth() + 1).padStart(2, "0");
//         const year = date.getFullYear();
//         return `${day}-${month}-${year}`;
//     };

//     return (
//         <div className="container mx-auto px-4 animate-fade-in animate-delay-200 animate-duration-slow">
//             <h1 className="text-2xl font-bold mb-4">{t("competitions")}</h1>

//             <div className="overflow-x-auto text-center rounded-lg border border-gray-200">
//                 <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
//                     <thead className="text-center">
//                         <tr>
//                             <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
//                                 {t("name-tournament")}
//                             </th>
//                             <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
//                                 {t("date-tournament")}
//                             </th>
//                             <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
//                                 {t("delegate")}
//                             </th>
//                         </tr>
//                     </thead>

//                     <tbody className="divide-y divide-gray-200">
//                         {data?.length > 0 ? (
//                             data?.map(({ id, name, start_date, end_date, delegates } = competition) => (
//                                 <tr key={id}>
//                                     <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
//                                         <Link
//                                             state={{ competition_id: id }}
//                                             to={`/competitions/${id}`}
//                                             className="text-blue-500 hover:text-blue-700"
//                                         >
//                                             {name}
//                                         </Link>
//                                     </td>
//                                     <td className="whitespace-nowrap px-4 py-2 text-gray-700">
//                                         {
//                                             `${formatDate(start_date)} ` + (start_date !== end_date ? ` - ${formatDate(end_date)}` : "")
//                                         }
//                                     </td>
//                                     <td className="whitespace-nowrap px-4 py-2 text-gray-700">
//                                         <ul className="list-none">
//                                             {delegates.map(({ name, url }) => (
//                                                 <li key={url}>
//                                                     <a
//                                                         href={url}
//                                                         className="text-blue-500 hover:text-blue-700 block"
//                                                     >
//                                                         {name}
//                                                     </a>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td className="whitespace-nowrap px-4 py-2 text-gray-700">
//                                     {t("no-competitions")}
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default ScoreCard;

import React, { useState } from "react";
import PDF from "../components/PDFS/PDF";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import axios from "axios";





const ScoreCardPDF = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'c6y2lary'); // Obtén esto desde Cloudinary

        setLoading(true);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/dlyzvzi9o/image/upload`,
                formData
            );
            setImageUrl(response.data.secure_url);
        } catch (error) {
            console.error("Error al subir la imagen", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 animate-fade-in animate-delay-200 animate-duration-slow">
            <h1 className="text-2xl font-bold mb-4">Score Card</h1>

            <input type="file" accept="image/*" onChange={handleImageUpload} />

            {loading ? (
                <p>Procesando imagen...</p>
            ) : (
                imageUrl && (
                    <>
                        <img
                            src={imageUrl}
                            alt="Grayscale"
                            style={{ width: "100%", maxWidth: "300px" }}
                        />
                        <PDFDownloadLink document={<PDF imageUrl={imageUrl} />} fileName="score-card.pdf">
                            {({ blob, url, loading, error }) =>
                                loading ? "Loading document..." : "Download now!"
                            }
                        </PDFDownloadLink>

                        <PDFViewer>
                            <PDF imageUrl={imageUrl} />
                        </PDFViewer>
                    </>
                )
            )}
        </div>
    );
};

export default ScoreCardPDF;

