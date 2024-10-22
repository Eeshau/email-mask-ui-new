'use client'
import Steps from "../components/Steps";
import NavBar from "../components/NavBar";
import '/app/globals.css'
import Envelope from "@/components/Envelope";

import { useContext } from 'react';
import { FileContext } from './FileContext'; 
import { useRouter } from 'next/navigation';

const About = () => {

    const { setFileContent } = useContext(FileContext);
    const router = useRouter();

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
            const content = event.target?.result;
            setFileContent(content);
            router.push('/prove');
            };
            reader.readAsText(file);
        }
        };

  return (
    <div className="p-4 grid grid-cols-6 gap-3">
        <div className="bg-noise px-[10px] relative h-full w-full col-span-6 md:col-span-4 flex flex-col justify-between h-full rounded-[10px] border-solid border-[0.5px] border-[#3B3B3B]">
            <div className="gradient-noise opacity-100 z-100 absolute inset-0 bg-gradient-to-r from-black via-[#24313D] to-black opacity-90 rounded-[10px]"></div>
            <NavBar  activeSection='change' mode='home'/>
            <div className="h-[400px]">
                <Envelope/>
            </div>
            <div className="text-center mx-auto text-white z-10 mb-[40px]">
                <div className="my-6">
                    <h1 className="text-2xl my-2 font-newsreader">Prove any contents for any email, sent or received</h1>
                    <p className="max-w-[500px] text-[#A8A8A8]">Prove only what content you want from an email. Hide what you don’t want known, also prove who sent the email</p>
                </div>
                <div className="text-center flex flex-col mx-auto w-full justify-center items-center">
                    <div className="file-input-container">
                        <label htmlFor="file-upload" className="file-input-label text-[10px] sm:text-[14px]">
                        Upload eml file
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3538 5.14625L9.85375 1.64625C9.80728 1.59983 9.75212 1.56303 9.69143 1.53793C9.63073 1.51284 9.56568 1.49995 9.5 1.5H3.5C3.23478 1.5 2.98043 1.60536 2.79289 1.79289C2.60536 1.98043 2.5 2.23478 2.5 2.5V13.5C2.5 13.7652 2.60536 14.0196 2.79289 14.2071C2.98043 14.3946 3.23478 14.5 3.5 14.5H12.5C12.7652 14.5 13.0196 14.3946 13.2071 14.2071C13.3946 14.0196 13.5 13.7652 13.5 13.5V5.5C13.5001 5.43432 13.4872 5.36927 13.4621 5.30858C13.437 5.24788 13.4002 5.19272 13.3538 5.14625ZM10 3.20688L11.7931 5H10V3.20688ZM12.5 13.5H3.5V2.5H9V5.5C9 5.63261 9.05268 5.75979 9.14645 5.85355C9.24021 5.94732 9.36739 6 9.5 6H12.5V13.5ZM9.85375 8.64625C9.90021 8.6927 9.93706 8.74786 9.9622 8.80855C9.98734 8.86925 10.0003 8.9343 10.0003 9C10.0003 9.0657 9.98734 9.13075 9.9622 9.19145C9.93706 9.25214 9.90021 9.3073 9.85375 9.35375C9.8073 9.40021 9.75214 9.43706 9.69145 9.4622C9.63075 9.48734 9.5657 9.50028 9.5 9.50028C9.4343 9.50028 9.36925 9.48734 9.30855 9.4622C9.24786 9.43706 9.1927 9.40021 9.14625 9.35375L8.5 8.70687V11.5C8.5 11.6326 8.44732 11.7598 8.35355 11.8536C8.25979 11.9473 8.13261 12 8 12C7.86739 12 7.74021 11.9473 7.64645 11.8536C7.55268 11.7598 7.5 11.6326 7.5 11.5V8.70687L6.85375 9.35375C6.8073 9.40021 6.75214 9.43706 6.69145 9.4622C6.63075 9.48734 6.5657 9.50028 6.5 9.50028C6.4343 9.50028 6.36925 9.48734 6.30855 9.4622C6.24786 9.43706 6.1927 9.40021 6.14625 9.35375C6.09979 9.3073 6.06294 9.25214 6.0378 9.19145C6.01266 9.13075 5.99972 9.0657 5.99972 9C5.99972 8.9343 6.01266 8.86925 6.0378 8.80855C6.06294 8.74786 6.09979 8.6927 6.14625 8.64625L7.64625 7.14625C7.69269 7.09976 7.74783 7.06288 7.80853 7.03772C7.86923 7.01256 7.93429 6.99961 8 6.99961C8.06571 6.99961 8.13077 7.01256 8.19147 7.03772C8.25217 7.06288 8.30731 7.09976 8.35375 7.14625L9.85375 8.64625Z" fill="#161819"/>
                        </svg>
                        </label>


                        <input
                            id="file-upload"
                            className="file-input"
                            type="file"
                            accept=".eml"
                            onChange={handleFileUpload}
                        />
                    </div>
                    <div className="flex items-center justify-center w-full my-6">
                        <div className="relative w-full text-center">
                            <span className="relative z-10 px-4 bg-[#24313D] text-white">OR</span>
                            <div className="absolute inset-0 flex items-center justify-between">
                            <span className="w-full h-[1px] bg-gradient-to-l from-white to-transparent"></span>
                            <span className="w-full h-[1px] bg-gradient-to-r from-white to-transparent"></span>
                            </div>
                        </div>
                    </div>
                    <button className="bg-[#1C1C1C] text-white text-[10px] sm:text-[14px] flex flex-row items-center   px-[20px] py-[10px] rounded-[12px] border-solid border-[1px] border-[#3B3B3B]">
                        Try our demo file
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M9.9338 7.30929L5.5588 11.6843C5.51815 11.7249 5.46989 11.7572 5.41678 11.7792C5.36367 11.8012 5.30675 11.8125 5.24927 11.8125C5.19178 11.8125 5.13486 11.8012 5.08175 11.7792C5.02864 11.7572 4.98038 11.7249 4.93974 11.6843C4.89909 11.6436 4.86684 11.5954 4.84484 11.5423C4.82285 11.4892 4.81152 11.4322 4.81152 11.3748C4.81152 11.3173 4.82285 11.2603 4.84484 11.2072C4.86684 11.1541 4.89909 11.1059 4.93974 11.0652L9.00575 6.99975L4.93974 2.93429C4.85764 2.85219 4.81152 2.74085 4.81152 2.62475C4.81152 2.50866 4.85764 2.39732 4.93974 2.31522C5.02183 2.23313 5.13317 2.18701 5.24927 2.18701C5.36536 2.18701 5.47671 2.23313 5.5588 2.31522L9.9338 6.69022C9.97448 6.73086 10.0067 6.77911 10.0288 6.83222C10.0508 6.88533 10.0621 6.94226 10.0621 6.99975C10.0621 7.05725 10.0508 7.11418 10.0288 7.16729C10.0067 7.2204 9.97448 7.26865 9.9338 7.30929Z" fill="#F5F3EF"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div className="col-span-6 md:col-span-2">
          <Steps/>            
        </div>
    </div>
  );
};

export default About;
