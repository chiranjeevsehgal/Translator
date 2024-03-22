import { useEffect, useState } from 'react';
import lang from './../language';

function Translator() {

    const [fromText, setFromText] = useState('');
    const [toText, setToText] = useState('');
    const [fromLanguage, setFromLanguage] = useState('en-GB');
    const [toLanguage, setToLanguage] = useState('hi-IN');
    const [languages, setLanguages] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLanguages(lang);
    }, []);

    const copyContent = (text) => {
        navigator.clipboard.writeText(text);
    }

    const utterText = (text, language) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        synth.speak(utterance);
    }

    const handleExchange = () => {
        let tempValue = fromText;
        setFromText(toText);
        setToText(tempValue);

        let tempLang = fromLanguage;
        setFromLanguage(toLanguage);
        setToLanguage(tempLang);
    };

    const handleTranslate = () => {
        setLoading(true);
        let url = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${fromLanguage}|${toLanguage}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setToText(data.responseData.translatedText);
                setLoading(false);
            });
    };

    
    const handleIconClick = (target, id) => {
        if (!fromText || !toText) return;

        if (target.classList.contains('fa-copy')) {
            if (id === 'from') {
                copyContent(fromText);
            } else {
                copyContent(toText);
            }
        } else {
            if (id === 'from') {
                utterText(fromText, fromLanguage);
            } else {
                utterText(toText, toLanguage);
            }
        }
    };


    return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h2 className='mb-8 text-xl'>Language Translation</h2>
                <div className="wrapper bg-white rounded-lg shadow-md p-8 max-w-3xl">
                    <div className="text-input flex gap-x-10">
                        <textarea
                            name="from"
                            className="from-text border-2 flex-1 rounded-md p-4 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Text"
                            id="from"
                            value={fromText}
                            onChange={(e) => setFromText(e.target.value)}
                        ></textarea>
                        <textarea
                            name="to"
                            className="from-text w-2 flex-1 rounded-md p-4 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 border-2"
                            placeholder="Translation"
                            id="to"
                            value={toText}
                            readOnly
                        ></textarea>
                    </div>
                    <ul className="controls flex justify-between mt-4 gap-x-4">
                        <li className="row from flex items-center">
                            <div className="icons flex">
                                <i
                                    id="from"
                                    className="fa-solid fa-volume-high mx-2 cursor-pointer text-gray-500 hover:text-blue-500"
                                    onClick={(e) => handleIconClick(e.target, 'from')}
                                ></i>
                                <i
                                    id="from"
                                    className="fa-solid fa-copy mx-2 cursor-pointer text-gray-500 hover:text-blue-500"
                                    onClick={(e) => handleIconClick(e.target, 'from')}
                                ></i>
                            </div>
                            <select
                                value={fromLanguage}
                                onChange={(e) => setFromLanguage(e.target.value)}
                                className="ml-4 py-2 px-3 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 "
                            >
                                {Object.entries(languages).map(([code, name]) => (
                                    <option key={code} value={code}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </li>
                        <li
                            className="exchange cursor-pointer text-gray-500 hover:text-blue-500"
                            onClick={handleExchange}
                        >
                            <i className="fa-solid fa-arrow-right-arrow-left"></i>
                        </li>
                        <li className="row to flex items-center">
                            <select
                                value={toLanguage}
                                onChange={(e) => setToLanguage(e.target.value)}
                                className="mr-4 py-2 px-3 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 border-2"
                            >
                                {Object.entries(languages).map(([code, name]) => (
                                    <option key={code} value={code}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                            <div className="icons flex">
                                <i
                                    id="to"
                                    className="fa-solid fa-copy mx-2 cursor-pointer text-gray-500 hover:text-blue-500"
                                    onClick={(e) => handleIconClick(e.target, 'to')}
                                ></i>
                                <i
                                    id="to"
                                    className="fa-solid fa-volume-high mx-2 cursor-pointer text-gray-500 hover:text-blue-500"
                                    onClick={(e) => handleIconClick(e.target, 'to')}
                                ></i>
                            </div>
                        </li>
                    </ul>
                </div>
                <button
                    onClick={handleTranslate}
                    disabled={loading}
                    className={`mt-8 py-2 px-4 rounded-md bg-cyan-500 text-white ${
                        loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-600'
                    }`}
                >
                    {loading ? 'Translating...' : 'Translate Text'}
                </button>
            </div>
        );
    
}

export default Translator;