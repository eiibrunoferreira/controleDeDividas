import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

export default function Header() {
  const defaultImage = "/profile.jpg";

  const [modalVisible, setModalVisible] = useState(false);
  const [inputName, setInputName] = useState("");

  const [name, setName] = useState(
    () => localStorage.getItem("@user_name") || ""
  );

  const [profileImage, setProfileImage] = useState(
    () =>
      localStorage.getItem("@user_profile_image") ||
      defaultImage
  );

  // Para crop
  const [cropModalVisible, setCropModalVisible] =
    useState(false);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState(null);


  // =========================================================
  // TRAVAR SCROLL DO FUNDO
  // =========================================================

  useEffect(() => {

    if (
      modalVisible ||
      cropModalVisible
    ) {

      document.body.classList.add(
        "overflow-hidden"
      );

    } else {

      document.body.classList.remove(
        "overflow-hidden"
      );

    }

    return () => {
      document.body.classList.remove(
        "overflow-hidden"
      );
    };

  }, [
    modalVisible,
    cropModalVisible,
  ]);


  // =========================================================
  // CARREGAR USUÁRIO
  // =========================================================

  useEffect(() => {

    const loadUser = async () => {

      const token =
        localStorage.getItem(
          "@auth_token"
        );

      if (!token) {
        return;
      }

      try {

        const response = await fetch(
          "https://controlededividas.onrender.com/users/me",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {

          console.error(
            data.error
          );

          return;

        }

        // -----------------------------------------------
        // NOME
        // -----------------------------------------------

        setName(data.name);

        localStorage.setItem(
          "@user_name",
          data.name
        );


        // -----------------------------------------------
        // FOTO
        // -----------------------------------------------

        if (data.profileImage) {

          setProfileImage(
            data.profileImage
          );

          localStorage.setItem(
            "@user_profile_image",
            data.profileImage
          );

        } else {

          setProfileImage(
            defaultImage
          );

          localStorage.removeItem(
            "@user_profile_image"
          );

        }

      } catch (error) {

        console.error(
          "Erro ao carregar usuário:",
          error
        );

      }

    };

    loadUser();

  }, []);


  // =========================================================
  // ESCOLHER IMAGEM
  // =========================================================

  const pickImage = (event) => {

    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onloadend = () => {

      setSelectedImage(
        reader.result
      );

      setCropModalVisible(
        true
      );

    };

    reader.readAsDataURL(file);

  };


  // =========================================================
  // CROP
  // =========================================================

  const onCropComplete = useCallback(
    (croppedArea, croppedPixels) => {

      setCroppedAreaPixels(
        croppedPixels
      );

    },
    []
  );


  // =========================================================
  // SALVAR FOTO
  // =========================================================

  const saveCroppedImage =
    useCallback(async () => {

      if (
        !selectedImage ||
        !croppedAreaPixels
      ) {

        return;

      }

      const croppedImage =
        await getCroppedImg(
          selectedImage,
          croppedAreaPixels
        );

      const token =
        localStorage.getItem(
          "@auth_token"
        );

      if (!token) {

        alert(
          "Usuário não autenticado."
        );

        return;

      }

      try {

        const response =
          await fetch(
            "https://controlededividas.onrender.com/users/me",
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                profileImage:
                  croppedImage,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          alert(
            data.error ||
            "Não foi possível salvar a foto."
          );

          return;

        }

        // -----------------------------------------------
        // ATUALIZAR NA TELA
        // -----------------------------------------------

        setProfileImage(
          data.profileImage ||
          defaultImage
        );


        // -----------------------------------------------
        // ATUALIZAR CACHE LOCAL
        // -----------------------------------------------

        if (data.profileImage) {

          localStorage.setItem(
            "@user_profile_image",
            data.profileImage
          );

        } else {

          localStorage.removeItem(
            "@user_profile_image"
          );

        }


        // -----------------------------------------------
        // FECHAR CROP
        // -----------------------------------------------

        setCropModalVisible(
          false
        );

        setSelectedImage(
          null
        );

      } catch (error) {

        console.error(
          "Erro ao salvar foto:",
          error
        );

        alert(
          "Não foi possível conectar ao servidor."
        );

      }

    }, [
      selectedImage,
      croppedAreaPixels,
    ]);


  // =========================================================
  // SALVAR NOME
  // =========================================================

  const saveName = async () => {

    if (!inputName.trim()) {
      return;
    }

    const token =
      localStorage.getItem(
        "@auth_token"
      );

    if (!token) {

      alert(
        "Usuário não autenticado."
      );

      return;

    }

    try {

      const response =
        await fetch(
          "https://controlededividas.onrender.com/users/me",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              name:
                inputName.trim(),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        alert(
          data.error ||
          "Não foi possível atualizar o nome."
        );

        return;

      }

      setName(
        data.name
      );

      localStorage.setItem(
        "@user_name",
        data.name
      );

      setModalVisible(
        false
      );

    } catch (error) {

      console.error(
        error
      );

      alert(
        "Não foi possível conectar ao servidor."
      );

    }

  };


  // =========================================================
  // INTERFACE
  // =========================================================

  return (
    <>
      {/* HEADER */}

      <div className="mt-5 mx-5 px-10 py-5 flex justify-between items-center bg-gradient-to-r from-[#10284D] to-[#0B1D39] rounded-2xl">

        <div>

          <p className="text-sm text-zinc-300">
            Bem-vindo,
          </p>

          <p
            className="text-xl font-bold text-white cursor-pointer hover:text-zinc-300 transition"

            onClick={() => {

              setInputName(
                name
              );

              setModalVisible(
                true
              );

            }}
          >
            {name
              ? name
              : "Digite seu nome aqui"}
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


      {/* ================================================= */}
      {/* MODAL DE NOME */}
      {/* ================================================= */}

      {modalVisible && (

        <div
          className="fixed inset-0 bg-slate-950/90 flex items-center justify-center p-5 z-50"

          onClick={() =>
            setModalVisible(false)
          }
        >

          <div
            className="bg-[#08162c] rounded-2xl p-6 w-full max-w-md"

            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h2 className="text-white text-xl font-semibold mb-4">
              Editar Nome
            </h2>

            <input
              className="w-full bg-slate-800 text-white p-3 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-white/30"

              placeholder="Digite seu nome"

              value={inputName}

              onChange={(e) =>
                setInputName(
                  e.target.value
                )
              }

              autoFocus
            />

            <button
              className="w-full bg-white text-black font-semibold p-3 rounded-xl transition"

              onClick={saveName}
            >
              Salvar
            </button>

            <button
              className="w-full bg-slate-800 text-white font-semibold p-3 rounded-xl mt-3 transition"

              onClick={() =>
                setModalVisible(false)
              }
            >
              Cancelar
            </button>

          </div>

        </div>

      )}


      {/* ================================================= */}
      {/* MODAL DE CROP */}
      {/* ================================================= */}

      {cropModalVisible && (

        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"

          onClick={() =>
            setCropModalVisible(false)
          }
        >

          <div
            className="bg-zinc-900 p-4 rounded-xl w-full max-w-md overflow-auto"

            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h2 className="text-white text-xl font-semibold mb-4">
              Ajustar Imagem
            </h2>

            <div className="relative w-full h-64 bg-gray-800">

              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={
                  onCropComplete
                }
              />

            </div>

            <div className="flex gap-2 mt-4">

              <button
                className="flex-1 bg-gray-600 text-white p-3 rounded"

                onClick={() =>
                  setCropModalVisible(
                    false
                  )
                }
              >
                Cancelar
              </button>

              <button
                className="flex-1 bg-white text-black p-3 rounded"

                onClick={
                  saveCroppedImage
                }
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