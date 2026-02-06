type Props = {
  videoId: string;
};

export default function YoutubeSection({ videoId }: Props) {
  return (
    <div className="invitation">
      <div className="youtube-wrap" aria-label="YouTube video">
        <iframe
          className="youtube-iframe"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
