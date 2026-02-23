import { useState } from "react";

export default function Header() {
  const defaultImage = "/profile.jpg";

  const [modalVisible, setModalVisible] = useState(false);
  const [inputName, setInputName] = useState("");

  const [name, setName] = useState(() => {
    return localStorage.getItem("@user_name") || "";
  });

  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem("@user_profile_image") || defaultImage;
  });

  const pickImage = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem("@user_profile_image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
          <p className="text-sm text-zinc-400 m-0">Bem-vindo,</p>

          <p
            className="text-xl font-bold text-white mt-1 cursor-pointer hover:text-zinc-300 transition"
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

      {/* MODAL */}
      {modalVisible && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-5 z-50"
          onClick={() => setModalVisible(false)}
        >
          <div
            className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-xl font-semibold mb-4">
              Editar Nome
            </h2>

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
    </>
  );
}