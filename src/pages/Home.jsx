import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const Home = () => {
    const { t } = useTranslation('global');

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const hashParams = new URLSearchParams(hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const expire = hashParams.get('expires_in');

            const date = new Date();
            date.setSeconds(date.getSeconds() + parseInt(expire));
            const expireDate = date.toISOString();

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('expire', expireDate);
            window.location = '/competitions';
        }
    }, []);

    return (
        <div className="mx-auto text-center w-full">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">{t("welcome")} <span className="text-red-500">TeamMaster</span></h2>

            <p className="text-lg text-gray-700 mb-6 text-justify">
                {t("description")} <a href="https://www.worldcubeassociation.org/" target='_blank'>WCA (World Cube Association)</a>
                <br />
                {t("with-teammaster")}
            </p>
            <ul className="list-disc list-inside text-left">
                <li>{t("tag1")}</li>
                <li>{t("tag2")}</li>
                <li>{t("tag3")}</li>
                <li>{t("tag4")}</li>
            </ul>
            <p className="text-lg text-gray-700 mt-6 text-justify">
                {t("more-info")}
            </p>
        </div>
    );
}