import {AllHTMLAttributes} from 'react';
import {useId} from '@react-aria/utils';

interface TooltipProps {
  role?: 'tooltip'
  id?: string
}

interface TooltipAria {
  tooltipProps: AllHTMLAttributes<HTMLElement>
}

export function useTooltip(props: TooltipProps): TooltipAria {
  let tooltipId = useId(props.id);

  let {
    role = 'tooltip'
  } = props;

  let tooltipProps = {
    role,
    id: tooltipId
  };

  return {
    tooltipProps
  };
}
