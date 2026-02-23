import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

export default function Header() {
  const defaultImage = "/profile.jpg";

  const [modalVisible, setModalVisible] = useState(false);
  const [inputName, setInputName] = useState("");
  const [name, setName] = useState(() => localStorage.getItem("@user_name") || "");
  const [profileImage, setProfileImage] = useState(() => localStorage.getItem("@user_profile_image") || defaultImage);

  // Para crop
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // 🟢 TRAVAR SCROLL DO FUNDO
  useEffect(() => {
    if (modalVisible || cropModalVisible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Remove ao desmontar só por segurança
    return () => document.body.classList.remove("overflow-hidden");
  }, [modalVisible, cropModalVisible]);

  const pickImage = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setCropModalVisible(true); // abre modal crop
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const saveCroppedImage = useCallback(async () => {
    if (!selectedImage || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels);
    setProfileImage(croppedImage);
    localStorage.setItem("@user_profile_image", croppedImage);
    setCropModalVisible(false);
  }, [selectedImage, croppedAreaPixels]);

  const saveName = () => {
    if (inputName.trim()) {
      const trimmed = inputName.trim();
      setName(trimmed);
      localStorage.setItem("@user_name", trimmed);
      setModalVisible(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="mt-5 mx-5 px-10 py-5 flex justify-between items-center bg-zinc-800 rounded-2xl">
        <div>
          <p className="text-sm text-zinc-400">Bem-vindo,</p>
          <p
            className="text-xl font-bold text-white cursor-pointer hover:text-zinc-300 transition"
            onClick={() => {
              setInputName(name);
              setModalVisible(true);
            }}
          >
            {name ? name : "Digite seu nome aqui"}
          </p>
        </div>

        <label className="cursor-pointer">
          <img
            src={profileImage}
            alt="Profile"
            className="w-[72px] h-[72px] rounded-full border-2 border-zinc-300 object-cover hover:scale-105 transition"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={pickImage}
          />
        </label>
      </div>

      {/* MODAL DE NOME */}
      {modalVisible && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-5 z-50"
          onClick={() => setModalVisible(false)}
        >
          <div
            className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-xl font-semibold mb-4">Editar Nome</h2>
            <input
              className="w-full bg-zinc-800 text-white p-3 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Digite seu nome"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              autoFocus
            />
            <button
              className="w-full bg-white text-black font-semibold p-3 rounded-xl hover:bg-zinc-200 transition"
              onClick={saveName}
            >
              Salvar
            </button>
            <button
              className="w-full bg-zinc-400 text-black font-semibold p-3 rounded-xl mt-3 hover:bg-zinc-500 transition"
              onClick={() => setModalVisible(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE CROP */}
      {cropModalVisible && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
          onClick={() => setCropModalVisible(false)}
        >
          <div
            className="bg-zinc-900 p-4 rounded-xl w-full max-w-md overflow-auto" // 🟢 SCROLL HABILITADO
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-xl font-semibold mb-4">Ajustar Imagem</h2>
            <div className="relative w-full h-64 bg-gray-800">
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="flex-1 bg-gray-600 text-white p-3 rounded"
                onClick={() => setCropModalVisible(false)}
              >
                Cancelar
              </button>
              <button
                className="flex-1 bg-white text-black p-3 rounded"
                onClick={saveCroppedImage}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}