import { ReactComponent as ApertureIcon } from "@icons/aperture.svg";
import { ReactComponent as CameraIcon } from "@icons/camera.svg";
import { ReactComponent as FilmIcon } from "@icons/film.svg";
import { Combobox } from "@components/preact/Combobox";
import type { FilterInit } from "@utils/helpers";
import type { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";
import { useFilterForm } from "./useFilterForm";

import styles from "./FilterForm.module.css";
import { EditBlock } from "./components/EditBlock";
import { Modal } from "../Modal";

export type FilterFormProps = FilterInit;

export const FilterForm: FunctionalComponent<FilterFormProps> = (props) => {
  const { children: _, ...rest } = props;
  const {
    camera,
    cameras,
    film,
    films,
    handleChange,
    handleModalToggle,
    isModalOpen,
    lens,
    lenses,
  } = useFilterForm(rest);

  const noscript = useMemo(
    () =>
      import.meta.env.SSR && (
        <noscript>
          <form className={styles.form} method="GET" action="/">
            {Array.isArray(rest.cameras) && (
              <Combobox
                name="camera"
                options={rest.cameras.map(({ model }) => model)}
                placeholder="Enter camera model"
                value={rest.camera?.model}
              />
            )}
            {Array.isArray(rest.lenses) && (
              <Combobox
                name="lens"
                options={rest.lenses.map(({ model }) => model)}
                placeholder="Enter lens model"
                value={rest.lens?.model}
              />
            )}
            {Array.isArray(rest.films) && (
              <Combobox
                name="film"
                options={rest.films.map(({ name }) => name)}
                placeholder="Enter film name"
                value={rest.film?.name}
              />
            )}
            <button type="submit" data-noprint>
              Submit
            </button>
          </form>
        </noscript>
      ),
    [
      rest.camera?.model,
      rest.cameras,
      rest.film?.name,
      rest.films,
      rest.lens?.model,
      rest.lenses,
    ]
  );

  return (
    <>
      {noscript}
      {!import.meta.env.SSR && (
        <button
          type="button"
          className={styles.button}
          onClick={handleModalToggle}
          title="Edit filters"
        >
          <CameraIcon
            className={camera ? styles.active : undefined}
            role="presentation"
            aria-hidden
          />
          <ApertureIcon
            className={lens ? styles.active : undefined}
            role="presentation"
            aria-hidden
          />
          <FilmIcon
            className={film ? styles.active : undefined}
            role="presentation"
            aria-hidden
          />
        </button>
      )}
      {isModalOpen && (
        <Modal
          onClose={handleModalToggle}
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <section className={styles.modalContent}>
            <h2 id="modal-title" className={styles.title}>
              Filters
            </h2>
            <p id="modal-description" className={styles.description}>
              Decrease or increase the displayed collection of images by
              adjusting the controls below.
            </p>
            {cameras.length > 0 && (
              <EditBlock
                name="camera"
                subtitle={camera?.make}
                title={camera?.model}
              >
                <Combobox
                  name="camera"
                  options={cameras}
                  placeholder="Enter camera model"
                  value={camera?.model ?? null}
                  onChange={(payload) => handleChange(payload, "camera")}
                />
              </EditBlock>
            )}
            {lenses.length > 0 && (
              <EditBlock name="lens" subtitle={lens?.make} title={lens?.model}>
                <Combobox
                  name="lens"
                  options={lenses}
                  placeholder="Enter lens model"
                  value={lens?.model ?? null}
                  onChange={(payload) => handleChange(payload, "lens")}
                />
              </EditBlock>
            )}
            {films.length > 0 && (
              <EditBlock name="film" subtitle={film?.brand} title={film?.name}>
                <Combobox
                  name="film"
                  options={films}
                  placeholder="Enter film name"
                  value={film?.name ?? null}
                  onChange={(payload) => handleChange(payload, "film")}
                />
              </EditBlock>
            )}
          </section>
        </Modal>
      )}
    </>
  );
};
