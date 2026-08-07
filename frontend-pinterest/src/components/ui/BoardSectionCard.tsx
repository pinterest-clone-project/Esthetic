import { APP_ENV } from "@/constants/env";
import type { BoardSection } from "@/services/boardSectionService";
import {useNavigate} from "react-router";

interface Props {
    section: BoardSection;
}

const BoardSectionCard = ({ section }: Props) => {
    const slots = [0, 1, 2];
    const navigate = useNavigate();

    return (
        <div className="w-44" onClick={()=>navigate(`/section/preview/${section.id}`)}>
            <div className="w-full h-28 rounded-xl overflow-hidden bg-[#2a2a2a] flex">
                {slots.map((index) => {
                    const pin = section.previewPins[index];

                    return (
                        <div
                            key={index}
                            className={`flex-1 overflow-hidden ${
                                !pin
                                    ? index === 0
                                        ? "bg-[#535353]"
                                        : index === 1
                                            ? "bg-[#454545]"
                                            : "bg-[#383838]"
                                    : "bg-[#2a2a2a]"
                            }`}
                        >
                            {pin?.image && (
                                <img
                                    src={`${APP_ENV.IMAGES_400_URL}${pin.image}`}
                                    alt={pin.title ?? "Pin"}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <p className="text-sm text-black dark:text-white mt-2 truncate">
                {section.title}
            </p>
        </div>
    );
};

export default BoardSectionCard;
