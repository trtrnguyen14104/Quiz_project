
import '../index.css';

export const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#101922] p-6">
      <div className="text-[#088395] text-3xl">{icon}</div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
};