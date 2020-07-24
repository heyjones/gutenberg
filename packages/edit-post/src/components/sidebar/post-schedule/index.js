/**
 * WordPress dependencies
 */
import { PanelBody } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	PostSchedule as PostScheduleForm,
	PostScheduleCheck,
	PostScheduleLabel,
} from '@wordpress/editor';
import { __ } from '@wordpress/i18n';

const PANEL_NAME = 'schedule';

export default function PostSchedule() {
	const { isOpened, isRemoved } = useSelect( ( select ) => {
		// We use isEditorPanelRemoved to hide the panel if it was
		// programatically removed. We don't use isEditorPanelEnabled since
		// this panel should not be disabled through the UI.
		const { isEditorPanelRemoved, isEditorPanelOpened } = select(
			'core/edit-post'
		);

		return {
			isOpened: isEditorPanelOpened( PANEL_NAME ),
			isRemoved: isEditorPanelRemoved( PANEL_NAME ),
		};
	}, [] );

	const { toggleEditorPanelOpened } = useDispatch( 'core/edit-post' );

	if ( isRemoved ) {
		return null;
	}

	return (
		<PostScheduleCheck>
			<PanelBody
				initialOpen={ false }
				opened={ isOpened }
				onToggle={ () => {
					toggleEditorPanelOpened( PANEL_NAME );
				} }
				title={
					<>
						{ __( 'Publish:' ) }
						<span className="editor-post-publish-panel__link">
							<PostScheduleLabel />
						</span>
					</>
				}
			>
				<PostScheduleForm />
			</PanelBody>
		</PostScheduleCheck>
	);
}
