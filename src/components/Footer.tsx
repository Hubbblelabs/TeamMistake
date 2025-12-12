const Footer = () => {
  return (
    <footer className="bg-tm-navy py-8 text-center border-t border-tm-navy-lighter">
      <p className="text-tm-slate-light text-sm font-mono">
        &copy; {new Date().getFullYear()} All Rights Reserved By{' '}
        <span className="text-tm-green">TeamMistake Technologies</span>
      </p>
    </footer>
  );
};

export default Footer;
