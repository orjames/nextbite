import React from 'react';
import { tagTypes } from './tagTypes';

const TagsInput = (props: any) => (
  <div className='tags-input-div'>
    <select
      onChange={(e) => props.handleTagsChange(e, props.num)}
      name='tags'
      placeholder='tags...'
    >
      <option value='' disabled>
        select...
      </option>
      {tagTypes.map((tag: string, index: number) => {
        return (
          <option className='' key={index}>
            {tag}
          </option>
        );
      })}
    </select>
  </div>
);

export default TagsInput;
