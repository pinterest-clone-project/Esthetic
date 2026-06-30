import { useSelector } from "react-redux";
import { selectUser } from "@/store/selectors/authSelectors.ts";

const BlockedPage = () => {
    const user = useSelector(selectUser);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white dark:bg-[#121212]">
            <div className="w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg
                    className="w-8 h-8 text-red-500 dark:text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                </svg>
            </div>

            <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                Ваш акаунт заблоковано
            </h1>

            {user?.blockReason && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
                    Причина: {user.blockReason}
                </p>
            )}

            <p className="text-sm text-gray-400 dark:text-gray-500">
                Якщо вважаєте це помилкою, зверніться до підтримки.
            </p>
        </div>
    );
};

export default BlockedPage;