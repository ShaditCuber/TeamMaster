import React from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import { useCompetitions } from "../queries/competitions";
import { useTranslation } from "react-i18next";

const Competitions = () => {
    const { data, isLoading } = useCompetitions();
    const { t } = useTranslation('global');

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">{t("competitions")}</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("name-tournament")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("date-tournament")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("delegate")}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((competition) => (
                            <tr key={competition.id} className="hover:bg-gray-300 cursor-pointer">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/competitions/${competition.id}`} className="text-blue-500 hover:text-blue-700">{competition.name}</Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{competition.start_date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{competition?.delegates[0]?.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Competitions;
