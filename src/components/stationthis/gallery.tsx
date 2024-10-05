import React, { useState, useEffect } from 'react';
import Header from '@/components/header'
import Image from 'next/image';

interface Generation {
    id: string;
    url: string;
    prompt: string;
}

const fetchGenerations = async (publicKey: string, page: number) => {
    try {
        const response = await fetch('/api/getGens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ publicKey, page }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch generations');
        }

        const generations = await response.json();
        return generations;  // Array of Generation objects
    } catch (error) {
        console.error('Error fetching generations:', error);
        return [];
    }
};

interface ImageGalleryProps {
    publicKey: string;
}

const Gallery: React.FC<ImageGalleryProps> = ({ publicKey }) => {
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [page, setPage] = useState<number>(1); // Track the current page
    const [selectedImage, setSelectedImage] = useState<Generation | null>(null); // Track selected image for detail view
    const imagesPerPage = 6; // Display 6 images at a time

    useEffect(() => {
        // Fetch the generations from your database based on the publicKey and page
        fetchGenerations(publicKey, page).then(setGenerations);
    }, [publicKey, page]);

    const handleNextPage = () => {
        setPage(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <>
        {/* <Header /> */}
        <div className="flex flex-col items-center justify-center">
            {/* Header: Display Wallet Address */}
            <div className="p-4 text-white bg-black rounded-lg">
                <h2 className="text-xl font-bold">{publicKey}</h2>
            </div>

            {/* Grid of Images */}
            <div className="grid grid-cols-3 gap-4 p-4">
                {generations.slice(0, imagesPerPage).map((gen) => (
                    <div
                        key={gen.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedImage(gen)}
                    >
                        <Image
                            src={gen.url}
                            alt="Generated image"
                            width="160"
                            height="160"
                            // className="w-32 h-32 rounded-lg"
                        />
                    </div>
                ))}
            </div>

            {/* Selected Image Detail */}
            {selectedImage && (
                <div className="p-4 bg-gray-800 rounded-lg text-white mt-4">
                    <h3 className="text-lg font-bold">Prompt Details</h3>
                    <p>{selectedImage.prompt}</p>
                    <Image
                        src={selectedImage.url}
                        alt="Selected image"
                        width="1024"
                        height="1024"
                        className="w-full h-auto mt-4 rounded-lg"
                    />
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-4">
                <button
                    className="px-4 py-2 bg-gray-500 rounded-full text-white"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <button
                    className="px-4 py-2 bg-gray-500 rounded-full text-white"
                    onClick={handleNextPage}
                >
                    Next
                </button>
            </div>
        </div>
        </>
    );
};

export default Gallery;
