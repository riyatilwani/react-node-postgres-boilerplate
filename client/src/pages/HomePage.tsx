import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);


  return (<div></div>)
}
