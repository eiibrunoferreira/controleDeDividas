import { useState } from "react";
import Header from "../components/Header";
import TotalToPay from "../components/TotalToPay";
import AddDividaButton from "../components/AddDividaButton";
import ButtonsCards from "../components/ButtonsCards";
import AddDebtModal from "../components/AddDebtModal";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-zinc-900 flex flex-col">

        <Header />
        <TotalToPay />

        <AddDividaButton onClick={() => setModalVisible(true)} />

        <div className="mt-5 mx-5">
          <ButtonsCards />
        </div>

        <div className="flex-1 flex items-end justify-center pb-4">
          <p className="text-white text-sm">
            © Direitos reservados Bruno Ferreira
          </p>
        </div>
      </div>

      <AddDebtModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}