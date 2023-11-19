import { useState } from 'react';

import useTranslation from 'next-translate/useTranslation';

import NoteModal from '@/components/Notes/NoteModal';
import PopoverMenu from '@/dls/PopoverMenu/PopoverMenu';
import NoteIcon from '@/icons/reader.svg';
import NoteType from '@/types/NoteType';
import { logButtonClick } from '@/utils/eventLogger';

type VerseNotesProps = {
  verseKey: string;
  isTranslationView: boolean;
};
const VerseNotes = ({ verseKey, isTranslationView }: VerseNotesProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation('common');

  const onItemClicked = () => {
    logButtonClick('verse_actions_menu_note', {
      isTranslationView,
    });
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <NoteModal
        isOpen={isModalOpen}
        onClose={onClose}
        type={NoteType.AyahsRange}
        typeId={verseKey}
      />
      <PopoverMenu.Item icon={<NoteIcon />} onClick={onItemClicked}>
        {t('notes.notes')}
      </PopoverMenu.Item>
    </>
  );
};

export default VerseNotes;
