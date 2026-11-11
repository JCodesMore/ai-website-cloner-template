import { team, teamIntro } from "./content/pages";
import { upload } from "./site-link";

/** "The Team That Drives Us" block shared by /about and /meet-your-travel-gurus. */
export function TeamSection({ id, className }: { id?: string; className?: string }) {
  return (
    <section id={id} className={className}>
      <div className="container">
        <p className="uppercase-subtitle border-after">Meet the Faces Behind the Magic</p>
        <h2 className="section-title">The Team That Drives Us</h2>
        <p>{teamIntro}</p>
        <div className="row bordered-posts">
          {team.map((m) => (
            <article key={m.name} className="col-lg-3 col-12 fourcol-container">
              <div className="row fourcol-inner flex flex-1">
                <div
                  className="col-12 bg-image-container"
                  role="img"
                  aria-label={m.name}
                  style={{ backgroundImage: `url('${upload(m.image)}')` }}
                />
                <div className="col-12 text-content">
                  <h3>{m.name}</h3>
                  <p>{m.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
