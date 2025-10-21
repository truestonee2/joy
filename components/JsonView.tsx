import React from 'react';
import type { JsonOutput } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import CodeBlock from './CodeBlock';

interface JsonViewProps {
  json: JsonOutput;
}

const JsonView: React.FC<JsonViewProps> = ({ json }) => {
  const { t } = useLanguage();
  const fullJsonString = JSON.stringify(json, null, 2);

  return (
    <div className="p-6 space-y-4">
      <CodeBlock 
        title={t('jsonTab')}
        language="json" 
        code={fullJsonString} 
        showCopyAll={true} 
      />

      {json.scenes.map(scene => (
        <CodeBlock 
          key={scene.scene_number}
          title={t('sceneTitle', { scene_number: scene.scene_number.toString() })}
          language="json"
          code={JSON.stringify(scene, null, 2)}
          showCopyAll={false}
        />
      ))}
    </div>
  );
};

export default JsonView;